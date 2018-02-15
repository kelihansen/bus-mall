'use strict';

const form = document.getElementById('settings-form');
form.addEventListener('submit', function() {
    event.preventDefault();
    const numberOfChoices = this.choices.value;
    const numberOfVotes = this.votes.value;
    const settings = {numberOfChoices: numberOfChoices, numberOfVotes: numberOfVotes};
    localStorage.setItem('settings', JSON.stringify(settings));
});

const resetButton = document.getElementById('reset-all');
resetButton.addEventListener('click', function() {
    const sure = confirm('CAUTION: This will clear all settings and all user data collected.');
    if (sure) {
        localStorage.clear();
    }
    form.reset();
});