### Agregar usuario
```js{.line-numbers}
let newUser = {
    id : 2641,
    email :'hacarapi@cofar.com.bo',                
    password,
    username:'Huber Acarapi Mamani',
    role:'Administrador'
};
newUser.password = await helpers.encryptPassword('cofar.2021');
console.log(newUser);
const result = await pool.query('INSERT INTO db_UsuariosySesiones.users SET ? ', newUser);
newUser.id = result.insertId;
console.log(newUser);
```

### Fomato Roles de usuario
```json{.line-numbers}
{
  "profile": {
    "fullname": "Huber Acarapi Mamani",
    "telephone": 76765486
  },
  "admin": {
    "user": {
      "viewer": true,
      "create": true,
      "update": true,
      "delete": false
    },
    "facilities": {
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "production":{
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "datalogers":{
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "fieldbus":{
      "viewer": true,
      "create": true,
      "update": true,
      "delete": true
    }
  }
}
```
#Formato recaptcha V3
```html{.line-numbers}
<script src="https://www.google.com/recaptcha/api.js?onload=bgcb&render={{public_key}}" async defer></script>
<script>
    async function bgcb() {
        const token = await grecaptcha.execute('{{public_key}}', {action: 'signup'})
        const res = await fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({token: token}), // MUST send as a serialized object
            headers: { 'Content-Type': 'application/json' }
        })
        document.querySelector('body').innerHTML = JSON.stringify(await res.json())
    }
</script>
```