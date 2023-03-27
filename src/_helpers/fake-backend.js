export { fakeBackend };

function fakeBackend() {
    let users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith('/users/authenticate') && opts.method === 'POST':
                        return authenticate();
                    case url.endsWith('/users') && opts.method === 'GET':
                        return getUsers();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            async function authenticate() {
                const { username, password } = body();
                console.log({ email: username, password })

                await fetch('https://interview-api.onrender.com/v1/auth/login', {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({ email: username, password }), // body data type must match "Content-Type" header
                }).then((res) => res.json()).then((res) => {
                    console.log(res)
                    return ok({
                        id: res.user.id,
                        username: res.user.name,
                        firstName: res.user.name,
                        lastName: res.user.name,
                        token: res.tokens.access.token
                    })
                }).catch((err) => {
                    console.log(err)
                    error('Username or password is incorrect')
                })
                // const user = users.find(x => x.username === username && x.password === password);

                // if (!user) return error('Username or password is incorrect');


            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok(users);
            }

            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) })
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
            }

            function isAuthenticated() {
                return opts.headers['Authorization'];
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }
        });
    }
}
