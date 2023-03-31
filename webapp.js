const express = require('express')
const app = express()

const fs = require('fs')
const PORT = 5000

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const tasks = JSON.parse(data)

        res.render('main', { tasks:tasks})
    })
})

app.post('/add', (req, res) => {
    const formData = req.body

    if (formData.tasks.trim() == '') {
        fs.readFile('./data/tasks.json', (err, data) => {
            if (err) throw err

            const tasks = JSON.parse(data)

            res.render('main', { error: true, tasks: tasks })
        })
    } else {
        fs.readFile('./data/tasks.json', (err, data) => {
            if (err) throw err
            
            const tasks  = JSON.parse(data)

            const task = {
                id: id(),
                caption: formData.tasks,
                done:false
            }

            tasks.push(task)

            fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
                if (err) throw err


                fs.readFile('./data/tasks.json', (err, data) => {
                    if (err) throw err

                    const tasks = JSON.parse(data)

                    res.render('main', { success: true, tasks: tasks })
                })
            })
        })
    }
})

app.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const tasks = JSON.parse(data)
        const filteredTasks = tasks.filter(task => task.id != id)

        fs.writeFile('./data/tasks.json', JSON.stringify(filteredTasks), (err) => {
            if (err) throw err 

            res.render('main', { tasks: filteredTasks, delete: true })
        })
    })
})

app.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const tasks = JSON.parse(data)
        const task = tasks.filter(task => task.id == id)[0]
        
        const taskIdx = tasks.indexOf(task)
        const splicedTask = tasks.splice(taskIdx, 1)[0]
        
        splicedTask.done = true
        tasks.push(splicedTask) 

        fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err) => {
            if (err) throw err 

            res.render('main', { tasks: tasks })
        })
    })
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log('The app runs on port'+ PORT)
})

function id() {
    return '_' + Math.random().toString(36).substring(2, 9);
}