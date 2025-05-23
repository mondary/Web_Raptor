document.addEventListener('DOMContentLoaded', () => {
    // const form = document.getElementById('userInfoForm'); // Plus besoin de référencer le formulaire entier pour le submit
    const resultsDiv = document.getElementById('results');
    const objectiveSelect = document.getElementById('objective');

    // Elements pour les inputs utilisateur
    const prenomInput = document.getElementById('prenom');
    const ageInput = document.getElementById('age');
    const tailleInput = document.getElementById('taille');
    const poidsInput = document.getElementById('poids');
    const bodyfatInput = document.getElementById('bodyfat');

    // Elements pour afficher les résultats de base
    const masseGrasseResultEl = document.getElementById('masseGrasseResult');
    const masseMaigreResultEl = document.getElementById('masseMaigreResult');
    const bmrHarrisBenedictResultEl = document.getElementById('bmrHarrisBenedictResult');
    const bmrKatchMcArdleResultEl = document.getElementById('bmrKatchMcArdleResult');
    const moyenneBmrResultEl = document.getElementById('moyenneBmrResult');
    const dejResultEl = document.getElementById('dejResult');
    const proteinesMaintenanceResultEl = document.getElementById('proteinesMaintenanceResult');
    const lipidesMaintenanceResultEl = document.getElementById('lipidesMaintenanceResult');
    const glucidesMaintenanceResultEl = document.getElementById('glucidesMaintenanceResult');

    // Elements pour afficher les résultats de l'objectif
    const objectiveTitleEl = document.getElementById('objectiveTitle');
    const protocolNameResultEl = document.getElementById('protocolNameResult');
    const protocolStepsResultsContainerEl = document.getElementById('protocolStepsResultsContainer');


    const protocolDetails = {
        "priseDeMusclePropre": {
            name: "Protocole 1 : Prise de muscle propre",
            steps: [
                { name: "Première étape (Maintenance)", calorieMod: 0, glucidesModRatio: 0 },
                { name: "Deuxième étape (+200 kcal)", calorieMod: 200, glucidesModRatio: 200 / 4 },
                { name: "Troisième étape (+400 kcal)", calorieMod: 400, glucidesModRatio: 400 / 4 }
            ]
        },
        "recompositionCorporelle": {
            name: "Protocole 2 : Recomposition corporelle",
            steps: [
                { name: "Première étape (-300 kcal)", calorieMod: -300, glucidesModRatio: -300 / 4 },
                { name: "Deuxième étape", calorieMod: "X", glucidesModRatio: "X" },
                { name: "Troisième étape", calorieMod: "X", glucidesModRatio: "X" }
            ]
        },
        "deficitParfait": {
            name: "Protocole 3 : Créer le déficit parfait",
            steps: [
                { name: "Première étape (-300 kcal)", calorieMod: -300, glucidesModRatio: -300 / 4 },
                { name: "Deuxième étape (-500 kcal)", calorieMod: -500, glucidesModRatio: -500 / 4 },
                { name: "Troisième étape", calorieMod: "X", glucidesModRatio: "X" }
            ]
        },
        "perteGrasProgressive": {
            name: "Protocole 4 : Perte de gras progressive",
            steps: [
                { name: "Première étape (-300 kcal)", calorieMod: -300, glucidesModRatio: -300 / 4 },
                { name: "Deuxième étape (-500 kcal)", calorieMod: -500, glucidesModRatio: -500 / 4 },
                { name: "Troisième étape (-700 kcal)", calorieMod: -700, glucidesModRatio: -700 / 4 }
            ]
        }
    };

    const objectiveInput = document.getElementById('objective');
    document.querySelectorAll('.protocol-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.protocol-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        objectiveInput.value = this.dataset.value;
        calculateAndDisplayResults();
      });
    });

    function calculateAndDisplayResults() {
        const prenom = prenomInput.value;
        const age = parseInt(ageInput.value);
        const tailleMetres = parseFloat(tailleInput.value);
        const poids = parseFloat(poidsInput.value);
        const bodyfatPercentage = parseFloat(bodyfatInput.value);
        const selectedProtocolKey = objectiveInput.value;
    
        // Vérifier si toutes les données numériques nécessaires sont valides
        if (isNaN(age) || isNaN(tailleMetres) || isNaN(poids) || isNaN(bodyfatPercentage) || !selectedProtocolKey) {
            resultsDiv.style.display = 'none';
            protocolStepsResultsContainerEl.innerHTML = '';
            objectiveTitleEl.style.display = 'none';
            return;
        }
    
        const tailleCm = tailleMetres * 100;
        const activityFactor = 1.5;
    
        const masseGrasseKg = poids * (bodyfatPercentage / 100);
        const masseMaigreKg = poids - masseGrasseKg;
        const bmrHarrisBenedict = 88.362 + (13.397 * poids) + (4.799 * tailleCm) - (5.677 * age);
        const bmrKatchMcArdle = 370 + (21.6 * masseMaigreKg);
        const moyenneBmr = (bmrHarrisBenedict + bmrKatchMcArdle) / 2;
        const dej = moyenneBmr * activityFactor;
    
        // Ratios issus de l'exemple fourni
        const proteinesMaintenanceRatio = 129 / 84;
        const lipidesMaintenanceRatio = 87 / 84;
    
        const proteinesMaintenance = poids * proteinesMaintenanceRatio;
        const lipidesMaintenance = poids * lipidesMaintenanceRatio;
        const caloriesFromProteinesMaintenance = proteinesMaintenance * 4;
        const caloriesFromLipidesMaintenance = lipidesMaintenance * 9;
        const glucidesMaintenance = (dej - caloriesFromProteinesMaintenance - caloriesFromLipidesMaintenance) / 4;
    
        masseGrasseResultEl.textContent = masseGrasseKg.toFixed(2);
        masseMaigreResultEl.textContent = masseMaigreKg.toFixed(2);
        bmrHarrisBenedictResultEl.textContent = bmrHarrisBenedict.toFixed(2);
        bmrKatchMcArdleResultEl.textContent = bmrKatchMcArdle.toFixed(2);
        moyenneBmrResultEl.textContent = moyenneBmr.toFixed(2);
        dejResultEl.textContent = dej.toFixed(0);
        proteinesMaintenanceResultEl.textContent = proteinesMaintenance.toFixed(0);
        lipidesMaintenanceResultEl.textContent = lipidesMaintenance.toFixed(0);
        glucidesMaintenanceResultEl.textContent = glucidesMaintenance.toFixed(0);
    
        // Affichage des étapes du protocole sélectionné
        const protocol = protocolDetails[selectedProtocolKey];
        if (protocol) {
            objectiveTitleEl.style.display = '';
            protocolNameResultEl.textContent = protocol.name;
            protocolStepsResultsContainerEl.innerHTML = '';
    
            // Étape 0 : Maintenance
            const maintenanceDiv = document.createElement('div');
            maintenanceDiv.className = 'protocol-step-result';
            maintenanceDiv.innerHTML = `<h3>Étape 0 : Maintenance</h3>
                <p><strong>Calories Cibles :</strong> ${dej.toFixed(0)} kcal</p>
                <p><strong>Protéines Cibles :</strong> ${proteinesMaintenance.toFixed(0)} g</p>
                <p><strong>Lipides Cibles :</strong> ${lipidesMaintenance.toFixed(0)} g</p>
                <p><strong>Glucides Cibles :</strong> ${glucidesMaintenance.toFixed(0)} g</p>
            `;
            protocolStepsResultsContainerEl.appendChild(maintenanceDiv);
    
            // Étapes du protocole
            protocol.steps.forEach((step, idx) => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'protocol-step-result';
                stepDiv.innerHTML = `<h3>Étape ${idx + 1} : ${step.name}</h3>`;
    
                if (step.calorieMod === "X" || step.glucidesModRatio === "X") {
                    stepDiv.innerHTML += `
                        <p><strong>Calories Cibles :</strong> X</p>
                        <p><strong>Protéines Cibles :</strong> X</p>
                        <p><strong>Lipides Cibles :</strong> X</p>
                        <p><strong>Glucides Cibles :</strong> X</p>
                    `;
                } else {
                    const caloriesCibles = dej + step.calorieMod;
                    const proteinesGrammesCibles = proteinesMaintenance;
                    const lipidesGrammesCibles = lipidesMaintenance;
                    const glucidesGrammesCibles = glucidesMaintenance + step.glucidesModRatio;
    
                    stepDiv.innerHTML += `
                        <p><strong>Calories Cibles :</strong> ${caloriesCibles.toFixed(0)} kcal</p>
                        <p><strong>Protéines Cibles :</strong> ${proteinesGrammesCibles.toFixed(0)} g</p>
                        <p><strong>Lipides Cibles :</strong> ${lipidesGrammesCibles.toFixed(0)} g</p>
                        <p><strong>Glucides Cibles :</strong> ${glucidesGrammesCibles.toFixed(0)} g</p>
                    `;
                }
                protocolStepsResultsContainerEl.appendChild(stepDiv);
            });
        } else {
            objectiveTitleEl.style.display = 'none';
            protocolStepsResultsContainerEl.innerHTML = '';
        }
    
        resultsDiv.style.display = 'block';
    }

        // Ajouter des listeners sur les autres champs pour recalculer si leurs valeurs changent
        // et qu'un protocole est déjà sélectionné.
        [prenomInput, ageInput, tailleInput, poidsInput, bodyfatInput].forEach(input => {
            input.addEventListener('input', () => {
                if (objectiveSelect.value) { // Recalculer seulement si un protocole est sélectionné
                    calculateAndDisplayResults();
                }
            });
        });


        function saveUserData(data) {
            localStorage.setItem('userData', JSON.stringify(data));
            console.log('Données utilisateur sauvegardées localement:', data);
        }

        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const userData = JSON.parse(storedData);
            prenomInput.value = userData.prenom || 'Clement';
            ageInput.value = userData.age || 41;
            tailleInput.value = userData.taille || 1.80;
            poidsInput.value = userData.poids || 84.0;
            bodyfatInput.value = userData.bodyfat || 23;
            if (userData.selectedProtocolKey) {
                objectiveSelect.value = userData.selectedProtocolKey;
                calculateAndDisplayResults(); // Calculer et afficher au chargement si un protocole était sauvegardé
            }
        }
    });

    // Enregistrement du Service Worker (inchangé)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker enregistré avec succès:', registration.scope);
                })
                .catch(error => {
                    console.log('Échec de l\'enregistrement du ServiceWorker:', error);
                });
        });
    }