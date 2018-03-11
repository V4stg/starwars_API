import database_common


@database_common.connection_handler
def all_users(cursor):
    cursor.execute('''SELECT * FROM users''')
    users = cursor.fetchall()
    return users


@database_common.connection_handler
def insert_new_user(cursor, user_data):
    cursor.execute('''INSERT INTO users (username, password)
                      VALUES (%(username)s,
                              %(password)s)
                      ON CONFLICT (username) DO NOTHING
                      RETURNING *
                   ''', user_data)
    return cursor.fetchone()


@database_common.connection_handler
def get_user_by_username(cursor, username):
    cursor.execute('''SELECT * FROM users
                    WHERE username = %(username)s    
                   ''', {'username': username})
    return cursor.fetchone()
