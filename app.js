let currentQuestion = 0;
let answers = [];

function startTest() {

    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;

    if (nama === "" || email === "") {
        alert("Nama dan Email wajib diisi.");
        return;
    }

    document.getElementById("identitySection").style.display = "none";
    document.getElementById("questionSection").style.display = "block";

    showQuestion();
}

function showQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("nomorSoal").innerHTML =
        `Soal ${currentQuestion + 1} dari ${questions.length}`;

    document.getElementById("questionText").innerHTML =
        q.no + ". " + q.text;

    let progress = ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById("progressBar").innerHTML =
        Math.round(progress) + "%";

    document.querySelectorAll('input[name="answer"]').forEach(r => {
        r.checked = false;
    });

    if (answers[currentQuestion]) {

        document.querySelector(
            `input[name="answer"][value="${answers[currentQuestion]}"]`
        ).checked = true;

    }

}

function nextQuestion() {

    let selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) {
        alert("Silakan pilih jawaban.");
        return;
    }

    answers[currentQuestion] = Number(selected.value);

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;
        showQuestion();

    } else {

        finishTest();

    }

}

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;
        showQuestion();

    }

}

function reverseScore(score) {

    return 6 - score;

}

function finishTest() {

    let score = {
        E: 0,
        A: 0,
        C: 0,
        N: 0,
        O: 0
    };

    questions.forEach((q, index) => {

        let nilai = answers[index];

        if (q.reverse) {

            nilai = reverseScore(nilai);

        }

        score[q.trait] += nilai;

    });

    // Persentase

    let hasil = {

        extraversion:
            Math.round(score.E / 40 * 100),

        agreeableness:
            Math.round(score.A / 45 * 100),

        conscientiousness:
            Math.round(score.C / 45 * 100),

        neuroticism:
            Math.round(score.N / 40 * 100),

        openness:
            Math.round(score.O / 50 * 100)

    };

    sendToGoogleSheet(hasil);

    document.getElementById("questionSection").style.display = "none";
    document.getElementById("finishSection").style.display = "block";

}

function sendToGoogleSheet(hasil) {

    const data = {

        nama: document.getElementById("nama").value,

        email: document.getElementById("email").value,

        gender: document.getElementById("gender").value,

        pendidikan: document.getElementById("pendidikan").value,

        tgllahir: document.getElementById("tgllahir").value,

        jawaban: answers,

        extraversion: hasil.extraversion,

        agreeableness: hasil.agreeableness,

        conscientiousness: hasil.conscientiousness,

        neuroticism: hasil.neuroticism,

        openness: hasil.openness

    };

    fetch("https://script.google.com/a/macros/badak.or.id/s/AKfycbyvsLuq4QUWSeg6_QgMdvglkw63NGAkhD53m2v813IMRc1jSfqGKI0ghcRyM5epvDi1/exec", {

        method: "POST",

        body: JSON.stringify(data)

    })

    .then(response => response.text())
    .then(result => {

        console.log("Data berhasil dikirim");

    })

    .catch(error => {

        console.log(error);

    });

}
