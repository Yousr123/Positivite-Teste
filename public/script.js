// Questions + catégorie (true = positive, false = negative)
const questions = [
  { txt: "Quel est le plus haut niveau d’amusement, d’espièglerie ou de drôlerie que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau de colère, d’irritation ou d’agacement que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau de honte, d’humiliation ou de déshonneur que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau d’émerveillement, de stupéfaction ou d’admiration que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau de mépris, de condescendance ou de dédain que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau de dégoût, de répulsion ou d’aversion que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau d’embarras, de gêne ou de rougeur que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau de gratitude, de reconnaissance ou de remerciement que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau de culpabilité, de repentir ou de responsabilité que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau de haine, de méfiance ou de suspicion que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau d’espoir, d’optimisme ou d’encouragement que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau d’inspiration, d’élévation ou d’enthousiasme que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau d’intérêt, de vigilance ou de curiosité que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau de joie, de bonheur ou de plaisir que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau d’amour, de proximité ou de confiance que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau de fierté, de confiance ou d’assurance que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau de tristesse, d’abattement ou de mal‑être que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau de peur, d’appréhension ou de crainte que vous avez ressenti ?", pos: false },
  { txt: "Quel est le plus haut niveau de sérénité, de contentement ou de paix que vous avez ressenti ?", pos: true },
  { txt: "Quel est le plus haut niveau de stress, de nervosité ou de submersion que vous avez ressenti ?", pos: false }
];

const choix = [
  { v: 0, lbl: "0 – Pas du tout" },
  { v: 1, lbl: "1 – Un petit peu" },
  { v: 2, lbl: "2 – Moyennement" },
  { v: 3, lbl: "3 – Beaucoup" },
  { v: 4, lbl: "4 – Extrêmement" }
];

const quiz = document.getElementById("quiz");
const resElt = document.getElementById("resultat");

// Injecte les questions dans le formulaire
questions.forEach((q, idx) => {
  const wrapper = document.createElement("div");
  wrapper.className = "question";

  const label = document.createElement("label");
  label.textContent = q.txt;
  label.setAttribute("for", `q${idx}`);

  const select = document.createElement("select");
  select.id = `q${idx}`;
  select.required = true;

  choix.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.v;
    opt.textContent = c.lbl;
    select.appendChild(opt);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  quiz.insertBefore(wrapper, quiz.lastElementChild); // avant le bouton
});

// ...

quiz.addEventListener("submit", e => {
  e.preventDefault();

  let posScore = 0; // nombre d'émotions positives ≥ 2
  let negScore = 0; // nombre d'émotions négatives ≥ 1

  questions.forEach((q, idx) => {
    const val = Number(document.getElementById(`q${idx}`).value);

    if (q.pos) {
      if (val >= 2) posScore += 1;   // “Moyennement” ou plus
    } else {
      if (val >= 1) negScore += 1;   // “Un petit peu” ou plus
    }
  });

  const ratio = negScore === 0 ? "∞" : (posScore / negScore).toFixed(2);
  const interpr = getInterpretation(posScore, negScore, ratio);

  resElt.innerHTML = `
    <h2>Vos scores du jour</h2>
    <p><strong>Score de positivité :</strong> ${posScore}</p>
    <p><strong>Score de négativité :</strong> ${negScore}</p>
    <p><strong>Ratio de positivité :</strong> ${ratio}</p>
    <h3>Comment interpréter ?</h3>
    <p>${interpr}</p>
  `;
  resElt.classList.remove("hidden");
  resElt.scrollIntoView({ behavior: "smooth" });
});

function getInterpretation(pos, neg, ratio) {
  if (ratio === "∞") {
    return "Aucune émotion négative signalée aujourd’hui : c’est exceptionnel ! Gardez toutefois à l’esprit que les émotions négatives jouent aussi un rôle d’alerte naturel.";
  }
  const r = parseFloat(ratio);
  if (r >= 3) {
    return "D’après les recherches de la Pr Fredrickson, un ratio supérieur à 3 :1 est associé à un état de <em>floraison</em> psychologique. Vous semblez sur la bonne voie pour prospérer.";
  }
  if (r >= 1) {
    return "Vous vivez davantage d’émotions positives que négatives, mais en‑deçà du seuil de 3 :1. Il y a une marge pour cultiver plus de positivité au quotidien.";
  }
  return "Vos émotions négatives ont dominé celles positives aujourd’hui. C’est fréquent et cela peut varier d’un jour à l’autre. Essayez de repérer de petites sources de joie ou de gratitude pour rééquilibrer la balance.";
}
