const hoursEl = document.querySelector('#hour')
const minutesEl = document.querySelector('#minute')
const secondsEl = document.querySelector('#second')
const toggle = document.querySelector('#toggle')
const timeEl = document.querySelector('#time')
const dateEl = document.querySelector('#date')


toggle.addEventListener('click', () =>{
    const html = document.querySelector('html');

    if (html.classList.contains('dark')){
        html.classList.remove('dark');
        toggle.innerHTML = 'Dark Mode'
    }else {
        html.classList.add('dark');
        toggle.innerHTML = 'Light Mode'
    }
});


const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


setInterval(() => {
    const time = new Date();
    const day = time.getDay();
    const date = time.getDate();
    const month = time.getMonth();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourIn12hr = hour % 12;
    const ampm = hour > 12 ? 'PM' : 'AM';


    dateEl.innerHTML = ` ${days[day]}, ${date}  ${months[month]}`;

    timeEl.innerHTML = ` ${hourIn12hr < 10 ? `0${hourIn12hr}`: hourIn12hr}:${minutes<10 ? `0${minutes}`: minutes} ${ampm}`;


    hoursEl.style.transform = `translate(-50%, -100%) rotate(${hour * 30}deg)` ;

    minutesEl.style.transform = `translate(-50%, -100%) rotate(${minutes * 6}deg)`;

    secondsEl.style.transform = ` translate(-50%, -100%) rotate(${seconds * 6}deg)`;
    const rotationDegrees = seconds * 6;
    secondsEl.style.transform = `translate(-50%, -100%) rotate(${rotationDegrees}deg)`;

}, 1000);


