const express = require('express')

const app = express();
const port = 3000;

app.use(express.json());

let alunos = []

app.get('/alunos', (req, res) => {
    try {
        const array = []

        alunos.forEach((element) => {
            const newArray = {
                nome: element.nome,
                turma: element.turma,
                ra: element.ra
            }

            array.push(newArray)
        })

        res.status(200).json(array)
    } catch (error) {
        res.status(500).json("Erro ao listar")
    }
})

app.get('/alunos/ra', (req, res) => {
    try {
        const { ra } = req.query;

        const aluno = alunos.find((aluno) => aluno.ra == ra)

        const { nome, turma, cursos, ...other } = aluno


        res.status(200).json({ nome, turma, cursos })
    } catch (error) {
        res.status(404).json("Aluno não encontrado")
    }

})

app.post('/alunos', (req, res) => {
    try {
        const { ra, nome, turma } = req.body;

        const novoAluno = {
            ra,
            nome,
            turma
        }

        alunos.push(novoAluno)

        res.status(201).json(novoAluno)

    } catch (error) {
        res.status(500).json('Erro' + error)
    }
})

app.post('/alunos/cursos/:ra', (req, res) => {
    try {
        const { ra } = req.params;
        const { curso } = req.body;

        let aluno = alunos.findIndex((aluno) => aluno.ra == ra)
        let dadosAluno = alunos.find((aluno) => aluno.ra == ra)


        if (aluno === -1) {
            return res.status(404).json("Aluno não encontrado")
        }

        let cursosAdd = dadosAluno.cursos ? dadosAluno.cursos : []

        cursosAdd.push(curso)

        alunos[aluno] = {
            ...dadosAluno,
            cursos: cursosAdd
        }

        res.status(200).json(alunos)
    } catch (error) {
        console.log(error);
        res.status(500).json("Erro ao criar curso")
    }
})

app.put('/alunos/cursos/:raAluno', (req, res) => {
    try {
        const { raAluno } = req.params;
        const { curso } = req.body;

        let aluno = alunos.findIndex((aluno) => aluno.ra == raAluno)
        let dadosAluno = alunos.find((aluno) => aluno.ra == raAluno)

        if (aluno === -1) {
            return res.status(404).json("Aluno não encontrado")
        }

        alunos[aluno] = {
            ...dadosAluno,
            cursos: curso
        }

        res.status(203).json(alunos)

    } catch (error) {
        console.log(error);
        res.status(500).json("erro ao buscar aluno")
    }
})

app.put('/alunos/:raAluno', (req, res) => {
    try {
        const { raAluno } = req.params;
        const { ra, nome, turma } = req.body;

        let dadosAluno = alunos.find((aluno) => raAluno == aluno.ra)
        let aluno = alunos.findIndex((aluno) => aluno.ra == raAluno)

        if (aluno === -1) {
            return res.status(404).json("Aluno não encontrado")
        }

        alunos[aluno] = {
            ra: ra ? String(ra) : aluno.ra,
            nome: nome ? String(nome) : aluno.nome,
            turma: turma ? String(turma) : aluno.turma
        }

        res.status(203).json(aluno)

    } catch (error) {
        res.status(500).json("erro ao buscar aluno")
    }
})

app.delete('/alunos/:raAluno', (req, res) => {
    try {
        const { raAluno } = req.params;

        alunos = alunos.filter((aluno) => raAluno == aluno.ra)

        res.status(200).json(alunos)

    } catch (error) {
        res.status(500).json("erro ao deletar aluno")
    }
})

app.delete('/alunos/cursos/:raAluno/:curso', (req, res) => {
    try {
        const { raAluno, curso } = req.params;

        const dadosAluno = alunos.find((aluno) => aluno.ra == raAluno)
        const indexAluno = alunos.findIndex((aluno) => aluno.ra == raAluno)

        let newData = dadosAluno.cursos.filter((cursoAtual) => cursoAtual != curso)

        alunos[indexAluno] = {
            ...dadosAluno,
            cursos: newData
        }

        res.status(200).json(alunos)

    } catch (error) {
        console.log(error);
        res.status(500).json("Não foi possível deletar curso")
    }
})

app.listen(port, () => {
    console.log(`Alunos app listening on port ${port}`)
})


