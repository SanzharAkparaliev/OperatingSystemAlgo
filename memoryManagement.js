const prompt = require("prompt-sync")({ sigint: true });

class Process{
    constructor(name,limit){
        this.name = name;
        this.limit = limit;
    }

    getName(){
        return this.name;
    }

    getLimit(){
        return this.limit;
    }
};

let totalSize = 200;
let allocationUnitSize = 4;
let bitmap_size = totalSize / allocationUnitSize;
let bitmap = new Boolean(bitmap_size);
let processes = new Map();
let isRunning = true;

console.log(`
First Fit алгоритми жана Bitmap ыкмасынын иштөөсүн моделдеген программа.
Эстин өлчөмү: 200 бит.
Бөлүү бирдиги: 4 бит.`)

do{
    console.log(`
---------------------------------------------------------------------------
1 - Жаңы процесс кошуу.
2 - Иштеп жаткан процессти токтотуу.
3 - Эстин учурдагы абалын экранга чыгаруу.
0 - Чыгуу.

`)

let command = prompt();
switch(command){
    case "1":
        console.log('Процесстин аты: ')
        let toCreate = prompt();
        console.log('Процесс эсте ээлей турган орундун өлчөмү (бит менен): ')
        let size = +prompt();
        let sizeInUnits = parseInt(size / allocationUnitSize)
        
        if(size % allocationUnitSize != 0){
            sizeInUnits++;
        }
        let freeUnitCounter = 0;
        let base = -1;
        isAllocated = false;

        for(let i=0; i<bitmap_size;i++){
            if(!bitmap[i]){
                if(base == -1){
                    base = i;
                }

                freeUnitCounter++;

                if(freeUnitCounter === sizeInUnits){
                    for(let j = base; j<base+sizeInUnits;j++){
                        bitmap[j]=true;
                    }

                    processes.set(base,new Process(toCreate,sizeInUnits));
                    isAllocated = true;
                    break;
                }
            }else if(base != -1){
                base = -1;
                freeUnitCounter = 0;
            }
        }

        if(isAllocated){
            console.log(` ${toCreate} процесси эсте жайгаштырылды.` )
        }else{
            console.log(` Бош орун табылган жок!`)
        }
        break;
    case "2":
        if(processes.size == 0){
            console.log(`Эсте эч бир процесс жок!`)
        }else{
            console.log(`Токтотула турган процесстин аты: `)
            let toDelete = prompt();
            isFound = false;

            for(let key of processes){
                console.log(key[1])
                if(key[1].getName() == toDelete){
                    for(let j = key[0]; j<key[0]+key[1].getLimit(); j++){
                        bitmap[j] = false;
                    }

                    processes.delete(key);
                    isFound = true;
                    break;
                }
            };

            if(isFound){
                console.log(`${toDelete} процесси эстен өчүрүлдү`)
            }else{
                console.log(`Мындай процесс жок!`)
            }
        }
        break;
    case "3":
        console.log(`-`.repeat(99))
        let i=0;
        while(i<bitmap_size){
            if(bitmap[i]){
                processes.get(i).getName().repeat(processes.get(i).getLimit());
                ans = "|" + processes.get(i).getName();
                console.log(ans.repeat(processes.get(i).getLimit()))
                i += processes.get(i).getLimit();
            }else{
                console.log("| ")
                i++;
            }
        }
        console.log("");
        console.log(`-`.repeat(70))
        break;
    case "0":
        isRunning = false;
        console.log("Көрүшкөнчө")
        break;
    default:
        console.log("Туура эмес буйрук. Сураныч, кайра кайталаңыз.")
        break;
}
}while(isRunning)