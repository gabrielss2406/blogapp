It is my one of my works in NodeJS
--
BLOGAPP<br>
Link: https://safe-beach-94099.herokuapp.com (somente como User comum)
--
Uma aplicação com funcionalidades de um blog, com divisões entre categorias. O principal motivo dessa aplicação foi o meu estudo em NodeJS, pois eu precisava realizar uma programação onde eu aprendesse conceitos e adquirisse experiencia, tanto em NodeJs, como em MongoDB

Usando o BLOGAPP
--
Para usuários comuns que buscam somente vizualizar as postagens realizadas, não é necessário Login(somente se desejado), podendo usufruir de todas as vizualizações de postagens realizadas por Adms. Podendo vizualizar as mais recentes em Home, e separado por categorias.

Para realizar postagens é necessário estar logado como administrador (indicado pelo campo eAdmin = 1 na collection user, sendo o cadastrado manual pelo desenvolvedor), utilizando das rotas '/admin/posts' e '/admin/categorias' para criar e editar, respectivamente, posts e categorias.

Algumas Tecnologias Usadas
--
MongoDB<br>
Git (para estar aqui no GitHub :)<br>
NodeJS ( Express , e várias dependencias como o Passport )<br>
Handlebars e Bootstrap (front-end)
