const fs = require('fs').promises;
const prompt = require('prompt-sync')();

const persons = { name: '', birthdate: '', phonenumber: '', email: '' };

(async () => {
    console.clear();
    await enterPersonalInfo();

    async function enterPersonalInfo() {
        const userInputName = prompt("Введіть ваше Прізвище та Ім'я через пробіл (Прізвище Ім'я): ");
        persons.name = userInputName.split(' ').reverse().join(' ');

        persons.email = getValidInput("Введіть вашу електронну пошту: ", isValidEmail);
        persons.phonenumber = getValidInput("Введіть ваш номер телефону (+380xxxxxxxxx): ", isValidPhoneNumber);
        persons.birthdate = getValidInput("Введіть ваш день народження (день місяць рік): ", isValidBirthdate).split(' ');

        let chooseAct;
        do {
            console.log(persons);
            chooseAct = prompt("Виберіть, що хочете зробити:\n1 - змінити, 2 - видалити, 3 - додати, 4 - зберегти, 5 - вийти, 6 - прочитати з файлу: ");

            switch (chooseAct) {
                case '1': changeProperty(); break;
                case '2': deleteProperty(); break;
                case '3': addProperty(); break;
                case '4': await saveToFile(); break;
                case '6': await readFileAndPrint(); break;
            }
        } while (chooseAct !== '5');
    }

    function changeProperty() {
        const propToChange = prompt("Введіть назву властивості, яку хочете змінити: ");
        persons[propToChange] = prompt("Введіть нове значення для властивості: ");
    }

    function deleteProperty() {
        const propToDelete = prompt("Введіть назву властивості, яку хочете видалити: ");
        delete persons[propToDelete];
    }

    function addProperty() {
        const newPropertyName = prompt("Введіть назву нової властивості: ");
        persons[newPropertyName] = prompt("Введіть значення для нової властивості: ");
    }

    async function saveToFile() {
        try {
            await fs.writeFile('persons.txt', JSON.stringify(persons, null, 2));
            console.log('Інформацію збережено у файл persons.txt');
        } catch (error) {
            console.error('Помилка під час збереження файлу:', error.message);
        }
    }

    async function readFileAndPrint() {
        try {
            const fileContent = await fs.readFile('persons.txt', 'utf8');
            console.log(JSON.parse(fileContent));
        } catch (error) {
            console.error('Помилка під час читання файлу:', error.message);
        }
    }

    function getValidInput(promptMessage, validationFunction) {
        let userInput;
        do {
            userInput = prompt(promptMessage);
            if (!validationFunction(userInput)) {
                console.log('Введено неправильне значення. Будь ласка, спробуйте ще раз.');
            }
        } while (!validationFunction(userInput));
        return userInput;
    }

    function isValidEmail(email) {
        return email.includes('@');
    }

    function isValidPhoneNumber(phoneNumber) {
        return phoneNumber.includes('+');
    }

    function isValidBirthdate(birthdate) {
        const [day, month, year] = birthdate.split(' ').map(Number);
        return birthdate.split(' ').length === 3 && !isNaN(day) && !isNaN(month) && !isNaN(year);
    }
})();