const axios = require("axios");

const baseURL = "http://localhost:5500";

describe("Test intégral API Authentification & Chantier", () => {
  let token = "";
  let userId = null;

  const randomEmail = `test${Date.now()}@example.com`;
  const password = "Test1234!";
  const userData = {
    email: randomEmail,
    password: password,
    user_type: "AD",
    firstname: "John",
    lastname: "Doe",
  };

  test("🟢 Inscription - devrait créer un nouvel utilisateur", async () => {
    const res = await axios.post(`${baseURL}/auth/register`, userData);
    expect(res.status).toBe(201);
    console.log("✅ Utilisateur inscrit avec succès");
  });

  test("🟢 Connexion - devrait retourner un token JWT", async () => {
    const res = await axios.post(`${baseURL}/auth/login`, {
      email: userData.email,
      password: userData.password,
    });

    console.log("🧾 Données retour login :", res.data);

    // Selon ton API adapte ici
    token = res.data.token || res.data.data?.token;
    console.log("🔑 Token reçu :", token);

    expect(token).toBeDefined();

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    userId = payload.id;
    console.log("🆔 User ID extrait du token :", userId);
    console.log("✅ Connexion réussie, token reçu");
    console.log("🆔 User ID extrait du token :", userId);
  });

  test("🟢 Création de chantier - devrait créer un chantier avec succès", async () => {
    console.log("🔐 Token utilisé pour la création de chantier :", token);

    const chantierData = {
      status_construction: "VA",
      n_worker: 10,
      address: "12 rue Test",
      postale_code: "75000",
      city: "Paris",
      country: "France",
      number_phone: "+33123456789",
      email: "contact@chantier.fr",
      users: [userId],
      stakeholderId: null,
    };

    const res = await axios.post(
      `${baseURL}/sites/construction-sites`,
      chantierData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(res.status).toBe(201);
    // expect(res.data).toHaveProperty("id");
    console.log("✅ Chantier créé avec succès :", res.data.id);
  });
});
