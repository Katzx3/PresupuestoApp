//Controlador de items
const itemCtrl = (function(){
    //constructor del item
    const Item = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    }
    //estructura de datos
    const data = {
        items:[]
    }
    //metodo publico
    return{
        logData: function(){
            return data;
        },
        addMoney: function(description, amount){
            //crear id aleatorio
            let ID = itemCtrl.createID();
            //crear nuevo item
            newMoney = new Item(ID, description, amount);
            //push en el array
            data.items.push(newMoney);

            return newMoney;
        },
        createID: function(){
            //genera un numero aleatorio
            const idNum = Math.floor(Math.random()*10000);
            return idNum;
        },
        getIdNumber: function(item){
            //recuperar id de item
            const amountId = (item.parentElement.id);
            //serparar el id
            const itemArr = amountId.split('-');
            //obtener numero de item
            const id = parseInt(itemArr[1]);

            return id;
        },
        deleteAmountArr: function(id){
            //obtener todos los ids
            const ids = data.items.map(function(item){
                //retornar los id
                return item.id
            });
            //obtener indice
            const index = ids.indexOf(id)
            //remover item
            data.items.splice(index, 1);
        }
    }
})();

//Controlador de interfaz
const UICtrl = (function(){
    //selectores de interfaz
    const UISelectors = {
        incomeBtn: '#add__income',
        expenseBtn: '#add__expense',
        description: '#description',
        amount: '#amount',
        moneyEarned: '#amount__earned',
        moneyAvailable: '#amount__available',
        moneySpent: '#amount__spent',
        moneyPercent: '#amount__percent',
        incomeList: '#income__container',
        expensesList: '#expenses__container',
        incomeItem: '.income__amount',
        expenseItem: '.expense__amount',
        itemsContainer: '.items__container'
    }
    //metodos publicos
    return{
        //retornar selector de interfaz
        getSelectors: function(){
            return UISelectors
        },
        getDescriptionInput: function(){
            return {
                descriptionInput: document.querySelector(UISelectors.description).value
            }
        },
        getValueInput: function(){
            return{
                amountInput: document.querySelector(UISelectors.amount).value
            }
        },
        addIncomeItem: function(item){
            //crear nuevo div
            const div = document.createElement('div');
            //agregar clase
            div.classList = 'item income'
            //agregar id al item
            div.id = `item-${item.id}`
            //agregar html
            div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__income">
                <p class="symbol">$</p>
                <span class="income__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;
            //insertar ingresos en la lista
            document.querySelector(UISelectors.incomeList).insertAdjacentElement('beforeend', div);
        },
        clearInputs: function(){
            document.querySelector(UISelectors.description).value = ''
            document.querySelector(UISelectors.amount).value = ''
        },
        updateEarned: function(){
            //todos los elementos de ingresos
            const allIncome = document.querySelectorAll(UISelectors.incomeItem);
            //arreglo con todos los ingresos
            const incomeCount = [...allIncome].map(item => +item.innerHTML);
            //calcular total de ingresos
            const incomeSum = incomeCount.reduce(function(a,b){
                return a+b
            },0);
            //mostrar total de ingresos
            const earnedTotal = document.querySelector(UISelectors.moneyEarned).innerHTML = incomeSum.toFixed(2);
        },
        addExpenseItem: function(item){
            //crear nuevo div
            const div = document.createElement('div');
            //agregar clase
            div.classList = 'item expense'
            //agregar id al item
            div.id = `item-${item.id}`
            //agregar html
            div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__expense">
                <p class="symbol">$</p>
                <span class="expense__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;
            //insertar ingresos en la lista
            document.querySelector(UISelectors.expensesList).insertAdjacentElement('beforeend', div);
        },
        updateSpent: function(){
            //todos los elementos de gastos
            const allExpenses = document.querySelectorAll(UISelectors.expenseItem);
            //arreglo con todos los gastos
            const expenseCount = [...allExpenses].map(item => +item.innerHTML)
            //calcular total
            const expenseSum = expenseCount.reduce(function(a, b){
                return a+b
            },0)
            // mostrar total de gastos
            const expensesTotal = document.querySelector(UISelectors.moneySpent).innerHTML = expenseSum;
        },
        updateAvailable: function(){
            const earned = document.querySelector(UISelectors.moneyEarned);
            const spent = document.querySelector(UISelectors.moneySpent)
            const available = document.querySelector(UISelectors.moneyAvailable);
            available.innerHTML = ((+earned.innerHTML)-(+spent.innerHTML)).toFixed(2)
        },
       
        deleteAmount: function(id){
            //crear el id que será seleccionado
            const amountId = `#item-${id}`;
            //seleccionar la cantidad de dinero del id seleccionado
            const amountDelete = document.querySelector(amountId);
            //remover de la interfas
            amountDelete.remove();
        },
        
        updatePercent: function(){
            const earned = document.querySelector(UISelectors.moneyEarned);
            const spent = document.querySelector(UISelectors.moneySpent)
            const available = document.querySelector(UISelectors.moneyPercent);
            available.innerHTML = Math.round(((spent.innerHTML)/(earned.innerHTML)*100).toFixed(2))
        }
    }
})();

//Controlador de aplicación
const App = (function(){
    //eventos
    const loadEventListeners = function(){
        //obtener selectores de interfaz
        const UISelectors = UICtrl.getSelectors();
        //agregar nuevo ingreso
        document.querySelector(UISelectors.incomeBtn).addEventListener('click', addIncome);
        //agregar nuevo gasto
        document.querySelector(UISelectors.expenseBtn).addEventListener('click', addExpense);
        //borrar item
        document.querySelector(UISelectors.itemsContainer).addEventListener('click', deleteItem);
    }

    //agregar nuevo ingreso
    const addIncome = function(){
        //obtener descripción del ingreso
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //si los formulatios no estan vaciós
        if(description.descriptionInput !=='' && amount.amountInput !== ''){
            //add new item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput);
            //agregar item a la lista
            UICtrl.addIncomeItem(newMoney);
            //limpiar entradas
            UICtrl.clearInputs();
            //actualizar ingresos
            UICtrl.updateEarned();
            //calcylar salgo disponible
            UICtrl.updateAvailable();
            UICtrl.updatePercent();
        }
    }

    //agregar nuevo gasto
    const addExpense = function(){
        //obtener dscripciones y montos
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //si no está vació el cuadro de ingresos
        if(description.descriptionInput !=='' && amount.amountInput !== ''){
            //agregar nuevo item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput);
            //agregar item a la lista
            UICtrl.addExpenseItem(newMoney);
            //limpiar entrada
            UICtrl.clearInputs();
            //actualuuzar total de gastos
            UICtrl.updateSpent();
            //ccalcular monto disponible
            UICtrl.updateAvailable();
            UICtrl.updatePercent();
        }
    }

    //borrar entrada
    const deleteItem = function(e){
        if(e.target.classList.contains('far')){
            //gobtener id
            const id = itemCtrl.getIdNumber(e.target)
            //borrar monto de la interfas
            UICtrl.deleteAmount(id);
            //borrar monto de los datos
            itemCtrl.deleteAmountArr(id);
            //actualizar ingresos
            UICtrl.updateEarned();
            //update actualizar gastos
            UICtrl.updateSpent();
            //calcular disponibles
            UICtrl.updateAvailable();
            UICtrl.updatePercent();
        }

        e.preventDefault()
    }

    //init de la función
    return{
        init: function(){
            loadEventListeners();
        }
    }

})(itemCtrl, UICtrl);

App.init();