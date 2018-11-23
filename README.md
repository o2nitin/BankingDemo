
## APi Docs

- https://banking-h.herokuapp.com/setup   -POST
body-
```
{
	"username":"Rohit",
	"name":"Rohit sharma",
	"password":"admin"
}
```

- https://banking-h.herokuapp.com/auth   -POST
body-
```
  {
	"username":"user",
	"password":"admin"
}
```

response-
```
{
    "success": true,
    "message": "Use this token for acess other information",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjViZjdkZWMzMGQ2ZTkyMTE1OTY0OGNjMyIsImlhdCI6MTU0Mjk3MTMxMSwiZXhwIjoxNTQzMDU3NzExfQ.fl1-ISz54ZeMXKhz76Pnv4L_11BTiavQuPWemZFnlNQ"
}
```

- https://banking-h.herokuapp.com/info    -GET
attach header-
x-access-token:"value of token"

- https://banking-h.herokuapp.com/transfer   -POST
attach header-
x-access-token:"value of token"

body- 
```{
	"account":13042,
	"ammount":16
}
```

- https://banking-h.herokuapp.com/addbeneficiary  -POST
attach header-
x-access-token:"value of token"

body-
```
{
	"account":13042
}
```


- node and npm

## Usage

1. Clone the repo: `git clone https://github.com/o2nitin/BankingDemo.git`
2. Install dependencies: `npm install`
3. Change SECRET in `config.js`
4. Add your own MongoDB database to `config.js` or can use the same cloud url
5. Start the server: `node server.js`
6. Create sample user by visiting: `http://localhost:8080/setup` with above body given api docs

Once everything is set up, we can begin to use our app by using tokens.


