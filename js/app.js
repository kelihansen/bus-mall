'use strict';

const numberOfChoices = 3;
const numberOfVotes = 25;

const survey = {
    products: [],
    previousSelections: [],
    totalSelections: 0,
    imageHolder: document.getElementById('img-holder'),
    begin: function() {
        this.products.push(
            new Product('Bag', 'img/bag.jpg'),
            new Product('Banana', 'img/banana.jpg'),
            new Product('Bathroom', 'img/bathroom.jpg'),
            new Product('Boots', 'img/boots.jpg'),
            new Product('Breakfast', 'img/breakfast.jpg'),
            new Product('Bubblegum', 'img/bubblegum.jpg'),
            new Product('Chair', 'img/chair.jpg'),
            new Product('Cthulhu', 'img/cthulhu.jpg'),
            new Product('Dog Duck', 'img/dog-duck.jpg'),
            new Product('Dragon', 'img/dragon.jpg'),
            new Product('Pen', 'img/pen.jpg'),
            new Product('Pet Sweep', 'img/pet-sweep.jpg'),
            new Product('Scissors', 'img/scissors.jpg'),
            new Product('Shark', 'img/shark.jpg'),
            new Product('Sweep', 'img/sweep.png'),
            new Product('Tauntaun', 'img/tauntaun.jpg'),
            new Product('Unicorn', 'img/unicorn.jpg'),
            new Product('USB', 'img/usb.gif'),
            new Product('Water Can', 'img/water-can.jpg'),
            new Product('Wine Glass', 'img/wine-glass.jpg')
        );
        this.displayProducts();
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
                        survey.totalSelections++;
                        break;
                    }
                }
                survey.clearProducts();
                if (survey.totalSelections < numberOfVotes) {
                    survey.displayProducts();
                } else {
                    survey.imageHolder.removeEventListener('click', collectVotes);
                    survey.displayResults();
                }
            }
        }
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
        }
    },
    clearProducts: function() {
        while (this.imageHolder.firstChild) {
            this.imageHolder.removeChild(this.imageHolder.firstChild);
        }
    },
    displayResults: function() {
        const chart = document.getElementById('chart');
        const context = chart.getContext('2d');
        const names = [];
        const shownCounts = [];
        const clickCounts = [];
        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];
            names.push(item.name);
            clickCounts.push(item.timesClicked);
            shownCounts.push(item.timesShown);
        }
        chart.classList.add('chart-style');
        new Chart(context, {
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: 'Times Shown',
                    data: shownCounts,
                    backgroundColor: 'rgba(87, 169, 217, .3)',
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

function Product (name, imageUrl) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.timesShown = 0;
    this.timesClicked = 0;
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