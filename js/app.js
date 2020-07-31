// query selector variables
const courses = document.querySelector('#courses-list'),
    shoppingCartContent = document.querySelector('#cart-content tbody'),
    clearCartBtn = document.querySelector('#clear-cart');

// load event listeners
loadEventListeners();

// function containing all event listeners
function loadEventListeners() {
    // listen when add to cart is clicked
    // invokes a call back function buyCourse
    courses.addEventListener('click', buyCourse);

    // apply event delegation to the shoppingCartContent
    // so that it removes the course from the cat
    shoppingCartContent.addEventListener('click', removeCourse);

    // event listener to clear the entire cart
    clearCartBtn.addEventListener('click', clearCart);

    // event listener to get courses from the local storage
    document.addEventListener('DOMContentLoaded', getFromLocalStorage);
}

// buy course call back function
function buyCourse(e) {
    // prevent the default link behaviour
    e.preventDefault();

    // delegate the event to find the course that was added
    if (e.target.classList.contains('add-to-cart')) {
        // get the main parent element
        const courseCard = e.target.parentElement.parentElement;

        // function to get the course content
        getCourse(courseCard);
    }
}

// function to get the course content based on selection
function getCourse(course) {
    // courseContent object to hold all the course data
    const courseContent = {
        image: course.querySelector('img').src,
        title: course.querySelector('h4').textContent,
        price: course.querySelector('.price span').textContent,
        id: course.querySelector('a').getAttribute('data-id')
    }

    // add the course to the cart
    addToCart(courseContent);
}

// function to add course contents to the cart
function addToCart(courseContent) {
    // create a table row
    const tableRow = document.createElement('tr');

    // add course contents to the row
    tableRow.innerHTML = `
        <tr>
            <td><img src=${courseContent.image} /></td>
            <td>${courseContent.title}</td>
            <td>${courseContent.price}</td>
            <td>
                <a href='#' class='remove' data-id=${courseContent.id}>X</a>
            </td>
        </tr>
    `;

    // add row to the shopping cart content
    shoppingCartContent.appendChild(tableRow);

    // add courses into the storage
    saveIntoStorage(courseContent);
}

// function to save contents in the local storage
function saveIntoStorage(course) {
    let courses = getCoursesFromStorage();

    // add the course to the courses array
    courses.push(course);

    // since storage only saves string we need to convert JSON into string
    localStorage.setItem('courses', JSON.stringify(courses));
}

// get the contents from storage
function getCoursesFromStorage() {
    let courses;

    // check if something exist in the local storage and return it else return the empty array
    return (localStorage.getItem('courses') == null) ? [] : JSON.parse(localStorage.getItem('courses'));
}

// function to remove the course from the DOM
function removeCourse(e) {
    let course, courseId;

    // remove from DOM
    if(e.target.classList.contains('remove')) {
        e.target.parentElement.parentElement.remove();
        course = e.target.parentElement.parentElement;
        courseId = course.querySelector('a').getAttribute('data-id');
    }

    // remove from local storage
    removeCourseFromLocalStorage(courseId)
}

// function to clear the entire cart
function clearCart() {
    while (shoppingCartContent.firstChild) {
        shoppingCartContent.removeChild(shoppingCartContent.firstChild);
    }

    // clear from localStorage
    clearLocalStorage();
}

// function to clear the local storage
function clearLocalStorage() {
    localStorage.clear();
}

// function to get courses from the local storage
function getFromLocalStorage() {
    let courses = getCoursesFromStorage();

    // loop through the courses
    courses.forEach(function (course) {
        // create the table row
        const row = document.createElement('tr');

        // add the content to the row
        row.innerHTML = `
            <tr>
                <td><img src=${course.image} /></td>
                <td>${course.title}</td>
                <td>${course.price}</td>
                <td>
                    <a href='#' class='remove' data-id=${course.id}>X</a>
                </td>
            </tr>
        `;

        // add row to the shopping cart content
        shoppingCartContent.appendChild(row);
    });
}

// function to remove the selected course from the local storage
function removeCourseFromLocalStorage(id) {
    // get all the courses
    let courses = getCoursesFromStorage();

    // loop through the courses and find the courses to remove
    courses.forEach(function (course, index) {
        if (course.id === id)
            courses.splice(index, 1);
    });

    // add the rest of the array
    localStorage.setItem('courses', JSON.stringify(courses));
}
