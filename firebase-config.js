/* =========================================================
   Très Jolie Festas — configuração do Firebase + Cloudinary
   =========================================================
   Firebase (login do admin + banco de dados dos cenários):
   Console do Firebase > Configurações do projeto (ícone de engrenagem)
   > Geral > "Seus apps" > app da Web > SDK setup and configuration.

   Essas chaves não são segredos (o Firebase foi feito para que o
   apiKey fique visível no navegador) — quem protege os dados são as
   regras de segurança do Firestore, configuradas no console.

   Cloudinary (hospedagem gratuita das fotos, sem precisar de cartão):
   Crie uma conta grátis em https://cloudinary.com/users/register/free
   O "Cloud name" aparece no topo do seu Dashboard.
   O "Upload preset" você cria em: Settings (engrenagem) > Upload >
   Upload presets > Add upload preset > Signing Mode: "Unsigned" > Save.
   ========================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyA1vn3iDmz7sf5FRG4r48lok3Zaq8yZnNs",
  authDomain: "tresjolie-f386d.firebaseapp.com",
  projectId: "tresjolie-f386d",
  storageBucket: "tresjolie-f386d.firebasestorage.app",
  messagingSenderId: "656136986648",
  appId: "1:656136986648:web:3fe1dea42a1e614cdfa36d",
};

window.CLOUDINARY_CLOUD_NAME = "dbr6ytslw";
window.CLOUDINARY_UPLOAD_PRESET = "tresjolie";

/* Só inicializa se as chaves já tiverem sido preenchidas.
   Assim o site continua funcionando normalmente (com o conteúdo
   fixo do HTML) enquanto o Firebase ainda não foi configurado. */
if (firebaseConfig.apiKey !== "SUA_API_KEY" && typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.auth = firebase.auth();
}
