'use strict';

const numberOfChoices = 3;
const numberOfVotes = 25;

const survey = {
    products: [],
    previousSelections: [],
    totalSelections: 0,
    imageHolder: document.getElementById('img-holder'),
    begin: function() {
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
        this.displayProducts();
        this.imageHolder.addEventListener('click', collectVotes);
    },
    getRandomProducts: function() {
        const selectedProducts = [];
        while (selectedProducts.length < numberOfChoices) {
            const randomIndex = Math.floor(Math.random() * this.products.length);
            const potentialProduct = this.products[randomIndex];
            if (selectedProducts.includes(potentialProduct) || this.previousSelections.includes(potentialProduct)) continue;
            selectedProducts.push(potentialProduct);
        }
        this.previousSelections = selectedProducts;
        return selectedProducts;
    },
    displayProducts: function() {
        const selectedProducts = this.getRandomProducts();
        for (let i = 0; i < numberOfChoices; i++) {
            const imagePanel = document.createElement('div');
            const newImage = selectedProducts[i].createImage();
            imagePanel.setAttribute('class', 'img-panel');
            imagePanel.appendChild(newImage);
            this.imageHolder.appendChild(imagePanel);
            selectedProducts[i].timesShown++;
            selectedProducts[i].cumulativeShown++;
        }
    },
    clearProducts: function() {
        while (this.imageHolder.firstChild) {
            this.imageHolder.removeChild(this.imageHolder.firstChild);
        }
    },
    end: function () {
        this.imageHolder.removeEventListener('click', collectVotes);
        this.displaySessionResults();
        this.displayCumulativeResults();
        localStorage.setItem('products', JSON.stringify(this.products));
    },
    displaySessionResults: function() {
        const sessionChart = document.getElementById('session-chart');
        const context = sessionChart.getContext('2d');
        const names = [];
        const shownCounts = [];
        const clickCounts = [];
        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];
            names.push(item.name);
            clickCounts.push(item.timesClicked);
            shownCounts.push(item.timesShown);
        }
        sessionChart.classList.add('chart-style');
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
                        categoryPercentage: 0.7
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
        const cumulativeChart = document.getElementById('cumulative-chart');
        const context = cumulativeChart.getContext('2d');
        const names = [];
        const shownCounts = [];
        const clickCounts = [];
        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];
            names.push(item.name);
            clickCounts.push(item.cumulativeClicked);
            shownCounts.push(item.cumulativeShown);
        }
        cumulativeChart.classList.add('chart-style');
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
                        categoryPercentage: 0.7
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
    }
};

function collectVotes() {
    let id = event.target.id;
    if (id === '') {
        id = event.target.firstElementChild.id;
    }
    if (id !== 'img-holder') {
        for (let i = 0; i < survey.products.length; i++) {
            const item = survey.products[i];
            if (id === item.idName) {
                item.timesClicked++;
                item.cumulativeClicked++;
                survey.totalSelections++;
                break;
            }
        }
        survey.clearProducts();
        if (survey.totalSelections < numberOfVotes) {
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