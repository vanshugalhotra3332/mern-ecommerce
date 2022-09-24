
# MERN Ecommerce 

Ecommerce website created using MERN Stack 


## Run Locally

Clone the project

```bash
  git clone https://github.com/vanshugalhotra3332/mern-ecommerce.git
```

Go to the project directory

```bash
  cd mern-ecommerce
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URL` : MongoDb Connection URL

`JWT_SECRET` : some string for creating JSON Web Token, for example: `anyrandomstring`

`JWT_EXPIRE` : expiry time for JSON Web Token, for example `3d` means 3 days

`SMTP_MAIL` : email from which you want to send email to users
`SMTP_PASSWORD` : password for the email


## Authors

- [@vanshugalhotra3332](https://www.github.com/vanshugalhotra3332)


## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express

**Database:** MongoDb

