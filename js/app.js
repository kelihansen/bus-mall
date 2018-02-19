'use strict';

const survey = {
    numberOfChoices: 3,
    numberOfVotes: 25,
    products: [],
    previousSelections: [],
    totalSelections: 0,
    imageHolder: document.getElementById('img-holder'),
    buttonHolder: document.getElementById('button-holder'),
    begin: function() {
        this.getSettings();
        this.getProducts();
        this.displayProducts();
        this.createDirections();
        this.createCounter();
        this.createClearButton();
        this.imageHolder.addEventListener('click', collectVotes);
    },
    getSettings: function() {
        if (localStorage.getItem('settings')) {
            const storedSettings = JSON.parse(localStorage.getItem('settings'));
            this.numberOfChoices = parseInt(storedSettings.numberOfChoices);
            this.numberOfVotes = parseInt(storedSettings.numberOfVotes);
        }
    },
    getProducts: function() {
        if (localStorage.getItem('products')) {
            const storedProducts = JSON.parse(localStorage.getItem('products'));
            for (let i = 0; i < storedProducts.length; i++) {
                const storedProduct = storedProducts[i];
                const updatedProduct = new Product(storedProduct.name, storedProduct.imageUrl, storedProduct.cumulativeShown, storedProduct.cumulativeClicked);
                this.products.push(updatedProduct);
            }
        } else {
            this.products.push(
                new Product('Bag', 'img/bag.jpg', 0, 0),
                new Product('Banana', 'img/banana.jpg', 0, 0),
                new Product('Bathroom', 'img/bathroom.jpg', 0, 0),
                new Product('Boots', 'img/boots.jpg', 0, 0),
                new Product('Breakfast', 'img/breakfast.jpg', 0, 0),
                new Product('Bubblegum', 'img/bubblegum.jpg', 0, 0),
                new Product('Chair', 'img/chair.jpg', 0, 0),
                new Product('Cthulhu', 'img/cthulhu.jpg', 0, 0),
                new Product('Dog Duck', 'img/dog-duck.jpg', 0, 0),
                new Product('Dragon', 'img/dragon.jpg', 0, 0),
                new Product('Pen', 'img/pen.jpg', 0, 0),
                new Product('Pet Sweep', 'img/pet-sweep.jpg', 0, 0),
                new Product('Scissors', 'img/scissors.jpg', 0, 0),
                new Product('Shark', 'img/shark.jpg', 0, 0),
                new Product('Sweep', 'img/sweep.png', 0, 0),
                new Product('Tauntaun', 'img/tauntaun.jpg', 0, 0),
                new Product('Unicorn', 'img/unicorn.jpg', 0, 0),
                new Product('USB', 'img/usb.gif', 0, 0),
                new Product('Water Can', 'img/water-can.jpg', 0, 0),
                new Product('Wine Glass', 'img/wine-glass.jpg', 0, 0)
            );
        }
    },
    displayProducts: function() {
        const selectedProducts = this.pickRandomProducts();
        for (let i = 0; i < this.numberOfChoices; i++) {
            const imagePanel = document.createElement('div');
            imagePanel.classList.add('img-panel');
            switch (this.numberOfChoices) {
            case 2:
                imagePanel.classList.add('two-images');
                break;
            case 3:
                imagePanel.classList.add('three-images');
                break;
            case 4:
                imagePanel.classList.add('four-images');
                break;
            case 5:
                imagePanel.classList.add('five-images');
                break;
            }
            const newImage = selectedProducts[i].createImage();
            imagePanel.appendChild(newImage);
            this.imageHolder.appendChild(imagePanel);
            selectedProducts[i].timesShown++;
            selectedProducts[i].cumulativeShown++;
        }
    },
    createDirections: function() {
        const directions = document.createElement('p');
        directions.id = 'directions';
        directions.textContent = 'Please click on the product you\'d be most likely to purchase from a catalog distributed on public transit.';
        const wrapper = document.getElementById('wrapper');
        const counterHolder = document.getElementById('counter-holder');
        wrapper.insertBefore(directions, counterHolder);
    },
    pickRandomProducts: function() {
        const selectedProducts = [];
        while (selectedProducts.length < this.numberOfChoices) {
            const randomIndex = Math.floor(Math.random() * this.products.length);
            const potentialProduct = this.products[randomIndex];
            if (selectedProducts.includes(potentialProduct) || this.previousSelections.includes(potentialProduct)) continue;
            selectedProducts.push(potentialProduct);
        }
        this.previousSelections = selectedProducts;
        return selectedProducts;
    },
    createCounter: function() {
        const counterHolder = document.getElementById('counter-holder');
        const p = document.createElement('p');
        counterHolder.appendChild(p);
        p.textContent = this.numberOfVotes + ' votes remaining';
    },
    createClearButton: function() {
        const clearButton = document.createElement('button');
        clearButton.id = 'clear';
        clearButton.setAttribute('type', 'button');
        clearButton.textContent = 'Clear & Restart';
        this.buttonHolder.appendChild(clearButton);
        clearButton.addEventListener('click', function() {
            survey.clearSession();
        });
    },
    clearProducts: function() {
        while (this.imageHolder.firstChild) {
            this.imageHolder.removeChild(this.imageHolder.firstChild);
        }
    },
    end: function () {
        localStorage.setItem('products', JSON.stringify(this.products));
        this.imageHolder.removeEventListener('click', collectVotes);
        this.createSaveButton();
        const directions = document.getElementById('directions');
        directions.remove();
        const clearButton = document.getElementById('clear');
        clearButton.remove();
        const counter = document.querySelector('#counter-holder p');
        counter.remove();
        this.displaySessionResults();
        this.displayCumulativeResults();
    },
    createSaveButton: function() {
        const saveButtonLabel = document.createElement('p');
        saveButtonLabel.textContent = 'Thank you! Your responses have been saved.';
        this.buttonHolder.appendChild(saveButtonLabel);
        const saveButton = document.createElement('button');
        saveButton.setAttribute('type', 'button');
        saveButton.textContent = 'Start New Round';
        this.buttonHolder.appendChild(saveButton);
        saveButton.addEventListener('click', function() {
            survey.restart();
            saveButtonLabel.remove();
            saveButton.remove();
        });
    },
    displaySessionResults: function() {
        const resultsHolder = document.createElement('section');
        resultsHolder.id = 'results-holder';
        const wrapper = document.getElementById('wrapper');
        wrapper.appendChild(resultsHolder);
        const sessionResultsLabel = document.createElement('h2');
        sessionResultsLabel.textContent = 'Your Responses';
        resultsHolder.appendChild(sessionResultsLabel);
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', '1000px');
        resultsHolder.appendChild(canvas);
        const context = canvas.getContext('2d');
        const names = [];
        const shownCounts = [];
        const clickCounts = [];
        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];
            names.push(item.name);
            clickCounts.push(item.timesClicked);
            shownCounts.push(item.timesShown);
        }
        new Chart(context, { //eslint-disable-line
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: 'Times Shown',
                    data: shownCounts,
                    backgroundColor: 'rgba(87, 169, 217, .2)',
                    borderWidth: 0
                },
                {
                    label: 'Times Selected',
                    data: clickCounts,
                    backgroundColor: 'rgba(87, 169, 217, 1)',
                    borderWidth: 0
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        barPercentage: 1,
                        categoryPercentage: 0.7,
                        ticks: {
                            autoSkip: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            stepSize: 1,
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },
    displayCumulativeResults: function () {
        const resultsHolder = document.getElementById('results-holder');
        const cumulativeResultsLabel = document.createElement('h2');
        cumulativeResultsLabel.textContent = 'All Responses';
        resultsHolder.appendChild(cumulativeResultsLabel);
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', '1000px');
        resultsHolder.appendChild(canvas);
        const context = canvas.getContext('2d');
        const names = [];
        const shownCounts = [];
        const clickCounts = [];
        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];
            names.push(item.name);
            clickCounts.push(item.cumulativeClicked);
            shownCounts.push(item.cumulativeShown);
        }
        new Chart(context, { //eslint-disable-line
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: 'Times Shown',
                    data: shownCounts,
                    backgroundColor: 'rgba(87, 169, 217, .2)',
                    borderWidth: 0
                },
                {
                    label: 'Times Selected',
                    data: clickCounts,
                    backgroundColor: 'rgba(87, 169, 217, 1)',
                    borderWidth: 0
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        barPercentage: 1,
                        categoryPercentage: 0.7,
                        ticks: {
                            autoSkip: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },
    clearSession: function() {
        if (confirm('Clear data from current session and begin again?')) {
            const directions = document.getElementById('directions');
            directions.remove();
            const clearButton = document.getElementById('clear');
            clearButton.remove();
            this.clearProducts();
            const counter = document.querySelector('#counter-holder p');
            counter.remove();
            this.products = [];
            this.totalSelections = 0;
            this.begin();
        }
    },
    restart: function() {
        this.clearResults();
        this.products = [];
        this.totalSelections = 0;
        this.begin();
    },
    clearResults: function() {
        const resultsHolder = document.getElementById('results-holder');
        resultsHolder.remove();
    }
};

function collectVotes() {
    let id = event.target.id;
    if (id !== 'img-holder') {
        if (id === '') {
            id = event.target.firstElementChild.id;
        }
        for (let i = 0; i < survey.products.length; i++) {
            const item = survey.products[i];
            if (id === item.idName) {
                item.timesClicked++;
                item.cumulativeClicked++;
                break;
            }
        }
        survey.totalSelections++;
        const counter = document.querySelector('#counter-holder p');
        const votesRemaining = survey.numberOfVotes - survey.totalSelections;
        let votes = 'votes';
        if (votesRemaining === 1) {
            votes = 'vote';
        }
        counter.textContent = votesRemaining + ' ' + votes + ' remaining';
        survey.clearProducts();
        if (survey.totalSelections < survey.numberOfVotes) {
            survey.displayProducts();
        } else {
            survey.end();
        }
    }
}

function Product (name, imageUrl, cumulativeShown, cumulativeClicked) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.timesShown = 0;
    this.cumulativeShown = cumulativeShown;
    this.timesClicked = 0;
    this.cumulativeClicked = cumulativeClicked;
    this.idName = this.imageUrl.slice(4, -4);
}

Product.prototype.createImage = function() {
    const imageElement = document.createElement('img');
    imageElement.src = this.imageUrl;
    imageElement.alt = this.name;
    imageElement.id = this.idName;
    return imageElement;
};

survey.begin();