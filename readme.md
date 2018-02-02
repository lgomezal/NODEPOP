# PRÁCTICA DEVOPS

Despliegue en servidor AWS de aplicación NODEPOP con NGINX, PM2 y MONGODB.

Web estática (plantilla de startbootstrap.com)         

```
http://35.169.158.143
```

Aplicación NODEPOP:

```
http://ec2-35-169-158-143.compute-1.amazonaws.com
```

En el apartado 'Documentación de uso' encontrará las posibles peticiones que se pueden realizar, se pueden probar con Postman:

```
http://ec2-35-169-158-143.compute-1.amazonaws.com + url de petición, ejemplo:

http://ec2-35-169-158-143.compute-1.amazonaws.com/apiv1/usuarios/registro
```

Ruta de archivos estáticos:

```
http://ec2-35-169-158-143.compute-1.amazonaws.com/images/anuncios/bici.jpg
```





# NODEPOP

Aplicación que devuelve una lista de anuncios para ser mostrados desde un cliente iOS o Android. La consulta es con autenticación de usuario con JWT. También existe la posibilidad de registro de usuarios.

El código está validado ESLint.

# Instalacion

La aplicación está desarrollada sobre la versión de Node v8.9.1 y sobre la versión de mongoDB v3.4.10 

Una vez clonado el repositorio nos colocarnos en el raiz del proyecto y ejecutamos ejecutar  ``` npm install ```


Se puede ejecutar un script de inicialización de la bbdd. Se debe tener abierto en el puerto 27017 mongodb. Para ejecutar el script utilizar el siguiente comando: 

```
npm run installDB
```

La API arranca por defecto en el puerto 3000: 

```
npm start
o
nodemon
```

La API se puede arrancar en modo cluster con el comando: 

```
node ./bin/cluster
```


***

#Documentación de uso:

*Para peticiones POST utilizar x-www-form-urlencoded*

###Registro de usuarios:
* URL

```
POST /apiv1/usuarios/registro
```

* PARÁMETROS (* OBLIGATORIOS)

```
* nombre: nombre
* email: email del usuario
* clave: contraseña
  lang: idioma de respuesta de error (es --> español, en --> inglés), 
  si no se especifica por defecto en --> inglés
```

* EJEMPLO DE RESPUESTA

```
{
    "success": true,
    "result": {
        "__v": 0,
        "nombre": "delga1",
        "email": "admin1@admin.com",
        "clave": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
        "_id": "5a32e76dcf4d6b0c5f01c20a"
    }
}
```


###Login de usuario (autenticación)
* URL

```
POST /apiv1/usuarios/authenticate
```

* PARÁMETROS (*OBLIGATORIOS)

```
* usuario: email del usuario
* clave: contraseña del usuario
  lang: idioma de respuesta de error (es --> español, en --> inglés), 
  si no se especifica por defecto en --> inglés

```

* EJEMPLO DE RESPUESTA

```
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzMmU3NmRjZjRkNmIwYzVmMDFjMjBhIiwiaWF0IjoxNTEzMjg1NzcwLCJleHAiOjE1MTM4OTA1NzB9.zzkOOpOAt_5uQQqxH61VP-ujT0eiLXOZL2-orIDLgXU"
}
```


****


###Listar anuncios:
* URL:

```
GET  /apiv1/anuncios
```
* PARÁMETROS (* OBLIGATORIOS):

```
* token: token de autenticación recibido en el login
  nombre: filtro por nombre (comienza por valor solicitado)
  venta: true --> Venta    false --> Compra
  - precio: valor --> precio = valor 
  - precio: -valor --> precio inferior o igual a valor;
  - precio: valor- --> precio igual o superior a valor; 
  - precio: valor1-valor2 --> precio entre valor1 y valor2 ambos incluidos;
  tag: filtro por tag, valores posibles = 'lifestyle', 'motor', 'mobile', 'work'
  lang: idioma de respuesta de error (es --> español, en --> inglés)
  sort: parámetro por el que devolver ordenado el listado
  limit: número límite de anuncios a devolver (por defecto 20)
  start: número de registros a descartar en la consulta

	
```
* EJEMPLO DE RESPUESTA:

```
{
	"success": true,
	"result": [
	{
		"_id": "5a32ca128e53ea04f9f1d901",
		"nombre": "Taladro",
		"venta": true,
		"precio": 110,
		"foto": "images/anuncios/taladro.png",
		"tags": "work"
	},
	{
		"_id": "5a32ca128e53ea04f9f1d8ff",
		"nombre": "Bicicleta",
		"venta": true,
		"precio": 230.15,
		"foto": "images/anuncios/bici.jpg",
		"tags": "lifestyle,motor"
	},
	{
		"_id": "5a32ca128e53ea04f9f1d903",
		"nombre": "iPad 4",
		"venta": true,
		"precio": 275,
		"foto": "images/anuncios/ipad.jpg",
		"tags": "mobile,lifestyle"
	},
	{
		"_id": "5a32ca128e53ea04f9f1d902",
		"nombre": "Vespa",
		"venta": false,
		"precio": 3500,
		"foto": "images/anuncios/vespa.png",
		"tags": "motor"
	}
	]
}
```

### Listar distintos tags de todos los anuncios
* URL

```
GET /apiv1/anuncios/tags
```

* PARÁMETROS (* OBLIGATORIOS)

```
* token: token de autenicación recibido en el login
  lang: idioma de respuesta de error (es --> español, en --> inglés)

```

* EJEMPLO DE RESPUESTA

```
{
	"success": true,
	"result": [
		"lifestyle",
		"motor",
		"mobile",
		"work"
	]
}
```

##Códigos de error:
```
    '451': {'es': 'Falta algun parametro requerido nombre-email-clave', 'en': 'The name-email-password is needed'},
    '452': {'es': 'Formato de email incorrecto', 'en': 'Incorrect email format'},
    '453': {'es': 'email ya registrado como usuario', 'en': 'email already registered as a user'},
    '454': {'es': 'Usuario o contraseña incorrectos', 'en': 'User or password incorrect'},
    '455': {'es': 'Token incorrecto', 'en': 'Token invalid'},
```


