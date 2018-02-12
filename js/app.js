'use strict';

const survey = {
    products: [],
    collectVotes: function() {
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
    }
};

function Product (name, imageUrl) {
    this.name = name;
    this.imageUrl = imageUrl;
    this.timesShown = timesShown;
    this.timesClicked = timesClicked;
    this.idName = idName;
}



// function Cuttlefish (name, imageUrl) {
//     this.name = name;
//     this.imageUrl = imageUrl;
//     this.timesCaught = 0;
// }

// Cuttlefish.prototype.render = function () {
//     const ele = document.createElement('img');
//     ele.src =  `media/images/${this.imageUrl}`;
//     ele.setAttribute('alt', this.name);
//     return ele;
// };