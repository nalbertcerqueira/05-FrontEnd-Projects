const axios = require("axios").default
const fs = require("fs")

//Criando uma base de dados a partir da quantidade passada no terminal
createPokemonDataBase(process.argv)

async function createPokemonDataBase(nodeArray){
    let pokemonNames = []
    let dataBase = []
    let totalPokemons = Number(nodeArray[2])
    totalPokemons > 1154? totalPokemons = 1154: ""

    if (!totalPokemons || typeof(totalPokemons)!="number"){
        console.log("It's nescessary to especify the total of pokemons as a number.")
        return
    }

    console.log(`Creating a data-base with ${totalPokemons} pokemons...`)
    try{
        pokemonNames =  await createPokemonList(totalPokemons)
        dataBase = await searchPokemonData(pokemonNames)
    }catch(error){
        console.log(error.message + 
            " during the search of pokemon name to create data base."
        )
    }

    fs.writeFile("./pokemons.json",JSON.stringify(dataBase,null,4),(error)=>{
        if (error){
            console.log(error.message)
            return
        }
        console.log("Sucess! Check the data base with name 'pokemons.json' in this directory.")
    })
    return
}
async function createPokemonList(total){
    let listOfNames = []
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${total}&offset=0`)
    for (let value of result.data.results){
        listOfNames.push(value.name)
    }
    return listOfNames
}
async function searchPokemonData(pokemonNames){
    let dataBase = []

    for(let name of pokemonNames){
    let result =  await (await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)).data
    const pokemonStat = {
            id: result.id,
            name: result.name,
            type:[],
            stats:{total:0},
            imgUrl: result.sprites.other["official-artwork"].front_default
        }

        for (let {type} of result.types){
            pokemonStat.type.push(type.name)
        }

        for (let {base_stat, stat} of result.stats){
            stat.name==="special-attack" ? stat.name = "spe-att": ""
            stat.name==="special-defense" ? stat.name = "spe-def": ""
            pokemonStat.stats[stat.name] = base_stat
            pokemonStat.stats.total += Number(base_stat)
        }

        dataBase.push(pokemonStat)

        if (dataBase.length%10===0)
        console.log(`${dataBase.length} pokemons searched.`)
    }
    return dataBase
}


// Essa função cria um arquivo json contendo todos os tipos de pokemons 
// juntamente com seus estilos. Por enquanto está em faze de testes.
// function createDataBaseOfTypes(){
//     const pokemons = require("./data-bases/pokemons.json")
//     let listOfTypes = []
//     let mainObj = {}

//     console.log("Creating data base with types and it's styles.")
//     console.log("...")
//     for (let {type}of pokemons){
//         listOfTypes.push(...type)
//     }
//     listOfTypes = [... new Set(listOfTypes)]

//     for (let type of listOfTypes){
//         mainObj[type] = {textColor:"", backColor:""}
//     }
//     fs.writeFile("./data-bases/types-styles.json", JSON.stringify(mainObj,null,4),(error)=>{
//         if (error){
//             console.log(error.message)
//             return
//         }
//         console.log("Sucess! Check the data base 'types-styles.json' in data-bases directory")
//     })
// }
