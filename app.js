let input = document.querySelector('textarea');
let result = document.getElementById("results");
let btnContainer = document.querySelector('.btnContainer');
let allEquations = [];
let allResults = [];
let moveHelperBool = false;
let currentView = '';

//on hover event to stop btn animation
btnContainer.addEventListener('mouseover', () => {
    pauseBtnAnimation();
})

btnContainer.addEventListener('mouseleave', () => {
    startBtnAnimation();
})

window.addEventListener('DOMContentLoaded', (e) => {
    //js mobile breakpoint
    setResponsive();
    //run the function if textarea has text in it onload
    run();
})

input.addEventListener('input', (e) => {
    // setResponsive();
    resultGetter(e);
})

window.addEventListener('resize', () => {
    setResponsive();
    run();
    // if(moveHelperBool && currentView !== 'DESKTOP') {
    //     let helpTxt = document.querySelector('.helpText');
    //     helpTxt.style.transform = null;
    //     helpTxt.style.transform = 'rotate(0%)';
    //     helpTxt.style.left = null;
    //     helpTxt.style.left = '20%';
    // }
    // window.location.reload();
})

let run = () => {
    //object to mimic the e.target.value concept
    //so that i can run the app on load
    let val = {
        target: { value: input.value}
    }
    resultGetter(val);
};

let pauseBtnAnimation = (option = 'pause') => {
    let btn = document.querySelector('button');
    if(option === 'pause') btn.style.animationPlayState = 'paused';
    if(option === 'stop') btn.classList.remove('slideAnimate');
}

let startBtnAnimation = () => {
    let btn = document.querySelector('button');
    if(!btn.classList.contains('slideAnimate')) 
    btn.classList.add('slideAnimate');
    btn.style.animationPlayState = 'running';
}

let setResponsive = () => {
    //less than 1025px greater than 750px -- TABLET
    let lT1025GT750 = () => {
        let helpTxt = document.querySelector('.helpText');
        helpTxt.style.width = '65vw';
        helpTxt.style.fontSize = '1rem';
        helpTxt.style.left = '0%';
        helpTxt.style.transform = 'rotate(0deg) translateY(8px) translateX(23%)';
        startBtnAnimation();
    }
    //less than 750px -- MOBILE
    let lT750 = () => {
        pauseBtnAnimation('stop');
        let helpTxt = document.querySelector('.helpText');
        helpTxt.style.width = '65vw';
        helpTxt.style.fontSize = '1rem';
        helpTxt.style.transform = 'rotate(0deg) translateY(8px) translateX(23%)';
    }
    //greater than 1025 -- DESKTOP
    let gT1025 = () => {
        let helpTxt = document.querySelector('.helpText');
        helpTxt.style.width = '300px';
        helpTxt.style.fontSize = '1rem';
        if(!moveHelperBool) helpTxt.style.transform = 'rotate(45deg) translateY(0px)';
        if(moveHelperBool) helpTxt.style.transform = 'rotate(-45%)';
        startBtnAnimation();
    }
    
    if(window.innerWidth < 1025 && window.innerWidth > 750) {
        //if window width is less than 1025 AND greater than 750
        currentView = 'TABLET';
        lT1025GT750();
    } else if(window.innerWidth < 750){
        //if less than 750
        currentView = 'MOBILE';
        lT750();
    }else {
        //desktop
        currentView = 'DESKTOP';
        gT1025();
    }
};

let resultGetter = (e) => {
            let equation = e.target.value;
            let str = equation.toString();
            let res = checkNums(str);
            mapNRenderResults(res);
};

let mapNRenderResults = (res) => {
    if(res) {
        removeChildNodes(result)
         // result.textContent += res;
         res.map(i => {
             let listItem = document.createElement("LI");
             let textNode = document.createTextNode(`${i}`);
             listItem.appendChild(textNode);
             listItem.style.listStyle = 'none';
             listItem.style.paddingLeft = '1rem';
             listItem.style.background = 'black';
             listItem.classList.add('calcFont');
             results.appendChild(listItem);
         })
    }
}

//removes the previous results so they dont stack
function removeChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function removeAlphabet(val) {
    let newStr = '';
    //Int_Operator captures integers and operators 
    //matching and returning using capture groups
    let Int_Operator = /(\d*\+*\/*\**\-*\.*)/gi;
    //value of the first object is matched with the regexp
    //return is the captured chars
    let de = val[0].match(Int_Operator);
    //returns in array format so join to have the entire equation
    newStr = de.join('');

    function isEquation(eq) {
        //checking is first char is integer
        let regexFront = /(^\d)/;
        //checking is last char is integer
        let regexBack = /(\d$)/;
        let checkFront = eq.match(regexFront);
        let checkBack = eq.match(regexBack);
        //if any of the variables return null then return false
        if(!checkBack || !checkFront) return false;
        //else return true
        return true;        
    }
    
    //check if is equation returns true or false
    if(isEquation(newStr)) return newStr; 
    else newStr[0];
        
}

function checkNums(str) {
    let values = [];
    let returnVals = [];
    //splits the value by the newline character 
    let newArr = str.split('\n');
    //save entire strings for use with copy button
    allEquations = newArr;
    //pulling new line seperated equations
    //if the string has a initial char
    newArr.map((i,index) => {if(newArr[index][0]) values.push([newArr[index]])})
    //code below makes sure the str provided only consists of numbers
    // and approved operators with function call
    values.map((val, index) => {
        let evalThis = removeAlphabet(val);
        //if it is in desktop view
        if(currentView === 'DESKTOP') moveHelper(index);
        if(!eval(evalThis)) {
            returnVals.push(`Equation on line ${index+= 1} is incomplete!`)
        }else {
            returnVals.push(eval(evalThis));
        }
    })
    //below is used for the copy button text
    allResults = returnVals;
    return returnVals;
}

//below moves the helper text out of the way of the text when
// it is 5 lines or lpnger
let moveHelper = (ind) => {
    if(ind >= 5 || input.value.split('\n').length >= 5) {
        let helpTxt = document.querySelector('.helpText');
        helpTxt.style.left = '75%';
        helpTxt.style.transform = null;
        helpTxt.style.transform = 'rotate(-45deg)';
        moveHelperBool = true;
    }else {
        let helpTxt = document.querySelector('.helpText');
        helpTxt.style.left = '0%';
        helpTxt.style.transform = null;
        helpTxt.style.transform = 'rotate(45deg)';
        moveHelperBool = false;
    }
}

function copyAll() {
    let resObj = [];
    //pushes the equation = result per line to array
    for( let i = 0; i < allResults.length; i++) {
        resObj.push(allEquations[i] + ' = ' + allResults[i]);
    }
    readyCopyText(resObj);
    let copyText = document.querySelector('.copyThis');
    //select selects text that you wish to copy within a field
    //execCommand is the copy command copying what was selected
    copyText.select();
    document.execCommand('copy');
    alert('Copied to clipboard!' + '\n\n' + resObj);
}

function readyCopyText(resObj) {
    //function creates and appends a textarea element
    //and creates a text node with the copy text
    // renders the created element off screen
    let str = resObj.join(',\n');
    let el = document.createElement("TEXTAREA");
    let text = document.createTextNode(str);
    el.appendChild(text);
    el.classList.add('copyThis');
    //styling to move copy text element off screen
    el.style.position = 'absolute';
    el.style.right = '100rem';
    result.appendChild(el);
}












    