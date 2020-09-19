/*
 * Name: Kelly Chhor
 * Date: November 13, 2019
 * Section: CSE 154 AL
 *
 * This is the index.js file linked to the index.html page. This allows interactivity
 * for users to make a to-do list.
 */

"use strict";

(function() {
  let itemNum = 0;

  window.addEventListener("load", init);

  /** Initializes the buttons and populates the menu with pokemon */
  function init() {
    fetch("/lists")
      .then(checkStatus)
      .then(resp => resp.json())
      .then(populateItems)
      .catch(console.error);
    id("open-btn").addEventListener("click", openFile);
    id("create-btn").addEventListener("click", displayCreateList);
    id("add-btn").addEventListener("click", addItem);
    id("submit-btn").addEventListener("click", addList);
  }

  /**
   * Populates the drop down menu for available to-do lists
   * @param {object} data - JSON object containing to-do list names available
   */
  function populateItems(data) {
    data = data.filename;
    for (let i = 0; i < data.length; i++) {
      let optionI = gen("option");
      optionI.value = data[i];
      optionI.textContent = data[i];
      qs("select").appendChild(optionI);
    }
  }

  /** Gets user selected list data from API */
  function openFile() {
    id("create").classList.add("hidden");
    let menu = qs("select");
    let fileName = menu.options[menu.selectedIndex].value;
    fetch("lists/" + fileName)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(displayList)
      .catch(handleError);
  }

  /**
   * Displays user selected list on page
   * @param {object} data - JSON object containing list details
   */
  function displayList(data) {
    id("display").innerHTML = "";
    let listName = gen("h2");
    listName.textContent = data.name;
    let itemList = gen("ul");
    for (let i = 0; i < data.items.length; i++) {
      let item = gen("li");
      item.textContent = data.items[i];
      itemList.appendChild(item);
    }
    id("display").classList.remove("hidden");
    id("display").appendChild(listName);
    id("display").appendChild(itemList);
  }

  /** Displays the form for creating to-do lists */
  function displayCreateList() {
    id("create").classList.remove("hidden");
    id("display").innerHTML = "";
    id("display").classList.add("hidden");
    let labels = qsa("#create label");
    for (let i = itemNum; i >= 1; i--) {
      qs("form").removeChild(qs("#item" + i));
      qs("form").removeChild(labels[i]);
    }
    itemNum = 0;
    addItem();
  }

  /** Adds a input box for another item during creation of list */
  function addItem() {
    itemNum++;
    let item = gen("input");
    item.type = "text";
    item.id = "item" + itemNum;
    let labelItem = gen("label");
    labelItem.htmlFor = item.id;
    labelItem.textContent = "Item " + itemNum;
    qs("form").insertBefore(labelItem, id("submit-btn"));
    qs("form").insertBefore(item, id("submit-btn"));
  }

  /** Adds the user created list to the API */
  function addList() {
    let listForm = new FormData();
    listForm.append("name", id("topic").value);
    let listItems = qsa("input");
    for (let i = 1; i < listItems.length; i++) {
      listForm.append("listitem" + i, listItems[i].value);
    }
    listForm.append("itemnum", itemNum);
    fetch("/submit", {method: "POST", body: listForm})
      .then(checkStatus)
      .then(resp => resp.text())
      .then(text => {
        let message = gen("p");
        message.textContent = text;
        id("create").insertBefore(message, id("add-btn"));
      })
      .catch(handleError);
  }

  /** Displays error messages when calling for API */
  function handleError() {
    let errorMessage = gen("p");
    errorMessage.textContent = "Something went wrong!";
    qs("body").appendChild(errorMessage);
    setTimeout(function() {
      qs("body").removeChild(errorMessage);
    }, 2000);
  }

  /**
   * Checks if call to API is sucessful or not
   * @param {object} response - object containing info requested by API
   * @return {object} same as above
   */
  function checkStatus(response) {
    if (!response.ok) { // response.status >= 200 && response.status < 300
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} - The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns html tag object user specifies
   * @param {string} tagName - Name of tag user wants to create
   * @returns {object} - Created object specified by parameter
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();
