import traceback
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from config import Config
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from MySQLdb.cursors import DictCursor  

app = Flask(__name__)
app.config.from_object(Config)
mysql = MySQL(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# 회원가입
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({'error': '모든 필드를 입력해주세요.'}), 400

    hashed_password = generate_password_hash(password)
    cursor = mysql.connection.cursor(DictCursor)

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'message': '이미 가입된 이메일입니다.'}), 400

        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_password)
        )
        mysql.connection.commit()

        return jsonify({'message': '회원가입 성공!'}), 201

    except Exception as e:
        print("에러 발생:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()

# 할 일 목록
@app.route('/todos', methods=['GET', 'POST'])
def handle_todos():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        user_id = 1  # 임시 하드코딩
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id, title, DATE_FORMAT(todo_date, '%%Y-%%m-%%d') AS todo_date, completed FROM todos WHERE user_id = %s", (user_id,))
        rows = cursor.fetchall()
        cursor.close()

        todos = [
            {
                'id': row[0],
                'task': row[1],
                'date': row[2],
                'completed': bool(row[3])
            }
            for row in rows
        ]

        return jsonify(todos)

    elif request.method == 'POST':
        data = request.get_json()
        print("📦 받은 데이터:", data)  # 🔍 디버깅용 로그

        title = data.get('task')  
        todo_date = data.get('date')
        user_id = 1  # 하드코딩된 유저

        if not title or not todo_date:
            return jsonify({'message': 'task 또는 date가 없습니다.'}), 400

        cursor = mysql.connection.cursor()
        try:
            cursor.execute(
                "INSERT INTO todos (title, user_id, todo_date, completed) VALUES (%s, %s, %s, %s)",
                (title, user_id, todo_date, False)
            )
            mysql.connection.commit()
            new_id = cursor.lastrowid

            return jsonify({
                'id': new_id,
                'task': title,
                'date': todo_date,
                'completed': False
            }), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 500
        finally:
            cursor.close()

# 할 일 완료 체크
@app.route('/todos/<int:todo_id>/complete', methods=['PATCH'])
def complete_todo(todo_id):
    cursor = mysql.connection.cursor(DictCursor)
    try:
        cursor.execute("UPDATE todos SET completed = TRUE WHERE id = %s", (todo_id,))
        mysql.connection.commit()
        return jsonify({'message': '완료 체크 완료'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    finally:
        cursor.close()

# 할 일 삭제
@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    cursor = mysql.connection.cursor(DictCursor)
    try:
        cursor.execute("DELETE FROM todos WHERE id = %s", (todo_id,))
        mysql.connection.commit()
        return jsonify({'message': '삭제 완료'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    finally:
        cursor.close()

# 로그인
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cursor = mysql.connection.cursor(DictCursor)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if user and check_password_hash(user['password'], password):
        return jsonify({
            'message': '로그인 성공',
            'user_id': user['id'],
            'token': '임시토큰'
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
