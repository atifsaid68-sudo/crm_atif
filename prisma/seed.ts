import { db } from "@/lib/db";

// Toutes les sociétés créées ici sont préfixées "[Démo]" pour être
// facilement identifiables et supprimables depuis l'interface
// (bouton "Supprimer la société" — la suppression est en cascade).

type SeedPosition = {
  key: string;
  titre: string;
  niveau: string;
  famille: string;
  reportsTo?: string;
  fiche?: { missions: string; competences: string; statut: "BROUILLON" | "VALIDE" };
};

type SeedEmployee = {
  prenom: string;
  nom: string;
  email: string;
  position: string;
  manager?: string;
  dateEmbauche: string;
};

type SeedCompany = {
  nom: string;
  secteur: string;
  adresse: string;
  contactNom: string;
  contactEmail: string;
  effectif: number;
  jobFamilies: { key: string; nom: string; description: string }[];
  positions: SeedPosition[];
  employees: SeedEmployee[];
};

const companies: SeedCompany[] = [
  {
    nom: "[Démo] Atlas Industries",
    secteur: "Industrie & BTP",
    adresse: "Zone Industrielle Sidi Bernoussi, Casablanca",
    contactNom: "Rachid Alaoui",
    contactEmail: "r.alaoui@atlas-industries.ma",
    effectif: 140,
    jobFamilies: [
      { key: "direction", nom: "Direction générale", description: "Pilotage stratégique du groupe" },
      { key: "production", nom: "Production", description: "Fabrication et supervision des lignes de production" },
      { key: "qualite", nom: "Qualité & HSE", description: "Contrôle qualité, hygiène, sécurité, environnement" },
      { key: "rh", nom: "Ressources humaines", description: "Gestion administrative et développement RH" },
    ],
    positions: [
      { key: "dg", titre: "Directeur Général", niveau: "Cadre dirigeant", famille: "direction",
        fiche: { missions: "Définir la stratégie du groupe, superviser les directions métiers, représenter la société auprès des partenaires.", competences: "Leadership, vision stratégique, négociation, gestion financière.", statut: "VALIDE" } },
      { key: "dir-prod", titre: "Directeur de Production", niveau: "Cadre", famille: "production", reportsTo: "dg",
        fiche: { missions: "Piloter l'ensemble des lignes de production, garantir les objectifs de rendement et de délai.", competences: "Gestion de production, Lean manufacturing, management d'équipe.", statut: "VALIDE" } },
      { key: "chef-atelier", titre: "Chef d'atelier", niveau: "Agent de maîtrise", famille: "production", reportsTo: "dir-prod",
        fiche: { missions: "Superviser une équipe d'opérateurs, assurer le suivi de production quotidien.", competences: "Organisation, résolution de problèmes, connaissance des machines de production.", statut: "BROUILLON" } },
      { key: "operateur", titre: "Opérateur de production", niveau: "Ouvrier qualifié", famille: "production", reportsTo: "chef-atelier" },
      { key: "resp-qualite", titre: "Responsable Qualité HSE", niveau: "Cadre", famille: "qualite", reportsTo: "dg",
        fiche: { missions: "Mettre en œuvre la politique qualité et sécurité, réaliser les audits internes.", competences: "Normes ISO, audit, gestion des risques.", statut: "VALIDE" } },
      { key: "resp-rh", titre: "Responsable RH", niveau: "Cadre", famille: "rh", reportsTo: "dg",
        fiche: { missions: "Gérer l'administration du personnel, le recrutement et les relations sociales.", competences: "Droit social marocain, gestion de la paie, recrutement.", statut: "VALIDE" } },
    ],
    employees: [
      { prenom: "Karim", nom: "Bennani", email: "k.bennani@atlas-industries.ma", position: "dg", dateEmbauche: "2015-03-01" },
      { prenom: "Nadia", nom: "Fassi", email: "n.fassi@atlas-industries.ma", position: "dir-prod", manager: "Karim Bennani", dateEmbauche: "2017-06-15" },
      { prenom: "Youssef", nom: "El Amrani", email: "y.elamrani@atlas-industries.ma", position: "chef-atelier", manager: "Nadia Fassi", dateEmbauche: "2019-01-10" },
      { prenom: "Sara", nom: "Idrissi", email: "s.idrissi@atlas-industries.ma", position: "operateur", manager: "Youssef El Amrani", dateEmbauche: "2021-09-01" },
      { prenom: "Hamza", nom: "Ouazzani", email: "h.ouazzani@atlas-industries.ma", position: "operateur", manager: "Youssef El Amrani", dateEmbauche: "2022-02-14" },
      { prenom: "Imane", nom: "Berrada", email: "i.berrada@atlas-industries.ma", position: "resp-qualite", manager: "Karim Bennani", dateEmbauche: "2018-11-05" },
      { prenom: "Othmane", nom: "Tazi", email: "o.tazi@atlas-industries.ma", position: "resp-rh", manager: "Karim Bennani", dateEmbauche: "2016-04-20" },
    ],
  },
  {
    nom: "[Démo] Banque du Sud",
    secteur: "Banque & Finance",
    adresse: "Boulevard Mohammed V, Rabat",
    contactNom: "Leila Chraibi",
    contactEmail: "l.chraibi@banquedusud.ma",
    effectif: 320,
    jobFamilies: [
      { key: "direction", nom: "Direction", description: "Gouvernance et pilotage" },
      { key: "reseau", nom: "Réseau d'agences", description: "Exploitation commerciale en agence" },
      { key: "risques", nom: "Risques & Conformité", description: "Gestion des risques et conformité réglementaire" },
      { key: "si", nom: "Systèmes d'information", description: "Infrastructure IT et développement" },
    ],
    positions: [
      { key: "dg", titre: "Directeur Général", niveau: "Cadre dirigeant", famille: "direction",
        fiche: { missions: "Piloter la stratégie bancaire, assurer la relation avec le régulateur (Bank Al-Maghrib).", competences: "Gouvernance bancaire, gestion des risques, leadership.", statut: "VALIDE" } },
      { key: "dir-reseau", titre: "Directeur du Réseau", niveau: "Cadre supérieur", famille: "reseau", reportsTo: "dg",
        fiche: { missions: "Animer le réseau d'agences, développer le portefeuille clients.", competences: "Management commercial, connaissance produits bancaires.", statut: "VALIDE" } },
      { key: "dir-agence", titre: "Directeur d'agence", niveau: "Cadre", famille: "reseau", reportsTo: "dir-reseau",
        fiche: { missions: "Gérer l'agence, encadrer les conseillers, atteindre les objectifs commerciaux.", competences: "Vente, management d'équipe, gestion de portefeuille.", statut: "BROUILLON" } },
      { key: "conseiller", titre: "Conseiller clientèle", niveau: "Employé qualifié", famille: "reseau", reportsTo: "dir-agence" },
      { key: "resp-conformite", titre: "Responsable Conformité", niveau: "Cadre", famille: "risques", reportsTo: "dg",
        fiche: { missions: "Veiller au respect de la réglementation bancaire et lutter contre le blanchiment.", competences: "Réglementation bancaire, LCB-FT, audit.", statut: "VALIDE" } },
      { key: "dsi", titre: "Directeur des Systèmes d'Information", niveau: "Cadre supérieur", famille: "si", reportsTo: "dg" },
      { key: "dev", titre: "Développeur applicatif", niveau: "Cadre", famille: "si", reportsTo: "dsi" },
    ],
    employees: [
      { prenom: "Ahmed", nom: "Chraibi", email: "a.chraibi@banquedusud.ma", position: "dg", dateEmbauche: "2012-01-15" },
      { prenom: "Meryem", nom: "Lahlou", email: "m.lahlou@banquedusud.ma", position: "dir-reseau", manager: "Ahmed Chraibi", dateEmbauche: "2014-05-01" },
      { prenom: "Yassine", nom: "Kadiri", email: "y.kadiri@banquedusud.ma", position: "dir-agence", manager: "Meryem Lahlou", dateEmbauche: "2017-08-12" },
      { prenom: "Salma", nom: "Bensouda", email: "s.bensouda@banquedusud.ma", position: "conseiller", manager: "Yassine Kadiri", dateEmbauche: "2020-03-01" },
      { prenom: "Anas", nom: "Guessous", email: "a.guessous@banquedusud.ma", position: "conseiller", manager: "Yassine Kadiri", dateEmbauche: "2021-07-19" },
      { prenom: "Fatima", nom: "Zahra Rifai", email: "f.rifai@banquedusud.ma", position: "resp-conformite", manager: "Ahmed Chraibi", dateEmbauche: "2016-02-10" },
      { prenom: "Omar", nom: "Belkadi", email: "o.belkadi@banquedusud.ma", position: "dsi", manager: "Ahmed Chraibi", dateEmbauche: "2015-09-01" },
      { prenom: "Rania", nom: "Squalli", email: "r.squalli@banquedusud.ma", position: "dev", manager: "Omar Belkadi", dateEmbauche: "2022-01-10" },
    ],
  },
  {
    nom: "[Démo] TechNova Solutions",
    secteur: "Technologies & Digital",
    adresse: "Technopark, Casablanca",
    contactNom: "Adam Berrada",
    contactEmail: "adam@technova.ma",
    effectif: 45,
    jobFamilies: [
      { key: "direction", nom: "Direction", description: "Direction générale et produit" },
      { key: "engineering", nom: "Engineering", description: "Développement logiciel" },
      { key: "commercial", nom: "Commercial", description: "Vente et relation client" },
    ],
    positions: [
      { key: "ceo", titre: "Fondateur & CEO", niveau: "Cadre dirigeant", famille: "direction",
        fiche: { missions: "Définir la vision produit, lever des fonds, superviser les équipes.", competences: "Vision produit, levée de fonds, leadership.", statut: "VALIDE" } },
      { key: "cto", titre: "CTO", niveau: "Cadre dirigeant", famille: "engineering", reportsTo: "ceo",
        fiche: { missions: "Définir l'architecture technique, encadrer l'équipe engineering.", competences: "Architecture logicielle, management technique.", statut: "VALIDE" } },
      { key: "lead-dev", titre: "Lead Developer", niveau: "Cadre", famille: "engineering", reportsTo: "cto",
        fiche: { missions: "Encadrer une équipe de développeurs, garantir la qualité du code livré.", competences: "TypeScript, revue de code, mentorat.", statut: "BROUILLON" } },
      { key: "dev-front", titre: "Développeur Frontend", niveau: "Cadre", famille: "engineering", reportsTo: "lead-dev" },
      { key: "dev-back", titre: "Développeur Backend", niveau: "Cadre", famille: "engineering", reportsTo: "lead-dev" },
      { key: "resp-com", titre: "Responsable Commercial", niveau: "Cadre", famille: "commercial", reportsTo: "ceo" },
    ],
    employees: [
      { prenom: "Adam", nom: "Berrada", email: "adam@technova.ma", position: "ceo", dateEmbauche: "2019-01-01" },
      { prenom: "Zineb", nom: "El Fassi", email: "zineb@technova.ma", position: "cto", manager: "Adam Berrada", dateEmbauche: "2019-03-01" },
      { prenom: "Yassir", nom: "Bouzid", email: "yassir@technova.ma", position: "lead-dev", manager: "Zineb El Fassi", dateEmbauche: "2020-06-01" },
      { prenom: "Hind", nom: "Amrani", email: "hind@technova.ma", position: "dev-front", manager: "Yassir Bouzid", dateEmbauche: "2022-04-11" },
      { prenom: "Mehdi", nom: "Kabbaj", email: "mehdi@technova.ma", position: "dev-back", manager: "Yassir Bouzid", dateEmbauche: "2021-10-05" },
      { prenom: "Lina", nom: "Sabir", email: "lina@technova.ma", position: "resp-com", manager: "Adam Berrada", dateEmbauche: "2020-09-14" },
    ],
  },
  {
    nom: "[Démo] Groupe Al Amal Retail",
    secteur: "Distribution & Retail",
    adresse: "Avenue Hassan II, Marrakech",
    contactNom: "Samira Ouahbi",
    contactEmail: "s.ouahbi@alamal-retail.ma",
    effectif: 210,
    jobFamilies: [
      { key: "direction", nom: "Direction", description: "Direction générale" },
      { key: "magasin", nom: "Exploitation magasin", description: "Gestion des points de vente" },
      { key: "logistique", nom: "Logistique", description: "Approvisionnement et supply chain" },
    ],
    positions: [
      { key: "dg", titre: "Directeur Général", niveau: "Cadre dirigeant", famille: "direction",
        fiche: { missions: "Piloter le développement du réseau de magasins.", competences: "Stratégie retail, développement d'enseigne.", statut: "VALIDE" } },
      { key: "dir-magasin", titre: "Directeur de magasin", niveau: "Cadre", famille: "magasin", reportsTo: "dg" },
      { key: "resp-rayon", titre: "Responsable de rayon", niveau: "Agent de maîtrise", famille: "magasin", reportsTo: "dir-magasin" },
      { key: "vendeur", titre: "Vendeur", niveau: "Employé", famille: "magasin", reportsTo: "resp-rayon" },
      { key: "resp-logistique", titre: "Responsable Logistique", niveau: "Cadre", famille: "logistique", reportsTo: "dg",
        fiche: { missions: "Superviser les approvisionnements et la gestion des stocks entre entrepôts et magasins.", competences: "Supply chain, gestion de stock, négociation fournisseurs.", statut: "BROUILLON" } },
    ],
    employees: [
      { prenom: "Samira", nom: "Ouahbi", email: "s.ouahbi@alamal-retail.ma", position: "dg", dateEmbauche: "2013-05-01" },
      { prenom: "Khalid", nom: "Naciri", email: "k.naciri@alamal-retail.ma", position: "dir-magasin", manager: "Samira Ouahbi", dateEmbauche: "2016-02-01" },
      { prenom: "Asmae", nom: "Bouhlal", email: "a.bouhlal@alamal-retail.ma", position: "resp-rayon", manager: "Khalid Naciri", dateEmbauche: "2019-06-15" },
      { prenom: "Reda", nom: "Iraqi", email: "r.iraqi@alamal-retail.ma", position: "vendeur", manager: "Asmae Bouhlal", dateEmbauche: "2022-08-01" },
      { prenom: "Nawal", nom: "Sefrioui", email: "n.sefrioui@alamal-retail.ma", position: "vendeur", manager: "Asmae Bouhlal", dateEmbauche: "2023-01-20" },
      { prenom: "Driss", nom: "Habti", email: "d.habti@alamal-retail.ma", position: "resp-logistique", manager: "Samira Ouahbi", dateEmbauche: "2017-11-01" },
    ],
  },
  {
    nom: "[Démo] Cabinet Juridique Benjelloun",
    secteur: "Services juridiques",
    adresse: "Quartier Gauthier, Casablanca",
    contactNom: "Hicham Benjelloun",
    contactEmail: "h.benjelloun@benjelloun-legal.ma",
    effectif: 18,
    jobFamilies: [
      { key: "direction", nom: "Associés", description: "Associés fondateurs" },
      { key: "juridique", nom: "Juridique", description: "Avocats et juristes" },
      { key: "support", nom: "Support", description: "Fonctions support administratives" },
    ],
    positions: [
      { key: "associe", titre: "Associé gérant", niveau: "Cadre dirigeant", famille: "direction",
        fiche: { missions: "Diriger le cabinet, gérer les dossiers stratégiques et la relation clients grands comptes.", competences: "Droit des affaires, négociation, développement commercial.", statut: "VALIDE" } },
      { key: "avocat-senior", titre: "Avocat senior", niveau: "Cadre", famille: "juridique", reportsTo: "associe" },
      { key: "avocat-junior", titre: "Avocat junior", niveau: "Cadre", famille: "juridique", reportsTo: "avocat-senior" },
      { key: "assistante", titre: "Assistante juridique", niveau: "Employé", famille: "support", reportsTo: "associe" },
    ],
    employees: [
      { prenom: "Hicham", nom: "Benjelloun", email: "h.benjelloun@benjelloun-legal.ma", position: "associe", dateEmbauche: "2010-01-01" },
      { prenom: "Widad", nom: "Cherkaoui", email: "w.cherkaoui@benjelloun-legal.ma", position: "avocat-senior", manager: "Hicham Benjelloun", dateEmbauche: "2015-09-01" },
      { prenom: "Amine", nom: "Zniber", email: "a.zniber@benjelloun-legal.ma", position: "avocat-junior", manager: "Widad Cherkaoui", dateEmbauche: "2021-11-02" },
      { prenom: "Ghita", nom: "Filali", email: "g.filali@benjelloun-legal.ma", position: "assistante", manager: "Hicham Benjelloun", dateEmbauche: "2018-04-16" },
    ],
  },
];

async function main() {
  for (const company of companies) {
    const created = await db.clientCompany.create({
      data: {
        nom: company.nom,
        secteur: company.secteur,
        adresse: company.adresse,
        contactNom: company.contactNom,
        contactEmail: company.contactEmail,
        effectif: company.effectif,
      },
    });

    const familyIds = new Map<string, string>();
    for (const f of company.jobFamilies) {
      const created_f = await db.jobFamily.create({
        data: { clientCompanyId: created.id, nom: f.nom, description: f.description },
      });
      familyIds.set(f.key, created_f.id);
    }

    const positionIds = new Map<string, string>();
    // Create positions in order so reportsTo can resolve to an already-created id.
    for (const p of company.positions) {
      const created_p = await db.position.create({
        data: {
          clientCompanyId: created.id,
          titre: p.titre,
          niveau: p.niveau,
          jobFamilyId: familyIds.get(p.famille),
          reportingPositionId: p.reportsTo ? positionIds.get(p.reportsTo) : null,
        },
      });
      positionIds.set(p.key, created_p.id);

      if (p.fiche) {
        await db.jobDescription.create({
          data: {
            positionId: created_p.id,
            missions: p.fiche.missions,
            competences: p.fiche.competences,
            statut: p.fiche.statut,
          },
        });
      }
    }

    const employeeIds = new Map<string, string>();
    for (const e of company.employees) {
      const fullName = `${e.prenom} ${e.nom}`;
      const created_e = await db.employee.create({
        data: {
          clientCompanyId: created.id,
          prenom: e.prenom,
          nom: e.nom,
          email: e.email,
          dateEmbauche: new Date(e.dateEmbauche),
          positionId: positionIds.get(e.position),
          managerId: e.manager ? employeeIds.get(e.manager) : null,
        },
      });
      employeeIds.set(fullName, created_e.id);
    }

    console.log(`Créé : ${company.nom}`);
  }
}

main()
  .then(() => {
    console.log("Données de démo créées avec succès.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
