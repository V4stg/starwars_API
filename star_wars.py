from flask import Flask, session, redirect, url_for, request, render_template, flash
import data_handler
import hash_handler
import os

app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        user_values = request.form.to_dict()
        hash_password = hash_handler.hash_password(user_values['password'])
        hash_verified_password = hash_handler.verify_password(user_values['verify_password'], hash_password)
        if hash_verified_password is True:
            user_values['password'] = hash_password
            inserted_user = data_handler.insert_new_user(user_values)

            if inserted_user:
                session['user_id'] = inserted_user['id']
                session['username'] = inserted_user['username']
                return redirect(url_for('index'))
            else:
                return render_template('signup.html', alert="this username already exists")
        else:
            return render_template('signup.html', alert="passwords do not match")
    else:
        return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_data = data_handler.get_user_by_username(username)

        is_login_successful = False
        if user_data:
            is_login_successful = hash_handler.verify_password(password, user_data['password'])

        if is_login_successful:
            session['user_id'] = user_data['id']
            session['username'] = user_data['username']
        else:
            flash('Invalid username or password')
    return redirect(url_for('index'))


@app.route('/logout')
def logout():
    if session['user_id'] or session['username'] is not None:
        session.clear()
    return redirect(url_for('index'))


def main():
    app.secret_key = os.environ.get('SECRET_KEY')
    app.run(port=8000,
            debug=True)


if __name__ == '__main__':
    main()
