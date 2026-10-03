/* =====================================================
   SMART INVENTORY MANAGEMENT
   JavaScript + 0/1 KNAPSACK + DYNAMIC PROGRAMMING
   ===================================================== */


/* =====================================================
   PRODUCT DATA
   ===================================================== */

/*
   Each product contains:

   name    = Product name
   storage = Amount of warehouse space required
   benefit = Expected benefit/value
*/

let products = [

    {
        name: "Laptop",
        storage: 5,
        benefit: 5000
    },

    {
        name: "Phone",
        storage: 3,
        benefit: 3000
    },

    {
        name: "Watch",
        storage: 2,
        benefit: 1500
    },

    {
        name: "Keyboard",
        storage: 4,
        benefit: 2000
    },

    {
        name: "Headphones",
        storage: 2,
        benefit: 1200
    }

];


/* =====================================================
   WAREHOUSE CAPACITY
   ===================================================== */

/*
   This variable stores the maximum
   storage capacity of the warehouse.
*/

let warehouseCapacity = 10;


/* =====================================================
   PAGE LOAD
   ===================================================== */

/*
   When the webpage loads,
   display all products.
*/

document.addEventListener("DOMContentLoaded", function () {

    displayProducts();

    updateDashboard();

});


/* =====================================================
   DISPLAY PRODUCTS
   ===================================================== */

/*
   This function displays products
   inside the HTML table.
*/

function displayProducts() {

    // Get the table body from HTML
    const table = document.getElementById("productTable");

    // Clear previous table data
    table.innerHTML = "";


    // Loop through every product
    products.forEach(function (product, index) {

        // Create a new table row
        const row = document.createElement("tr");


        // Insert product information
        row.innerHTML = `

            <td>
                <strong>${product.name}</strong>
            </td>

            <td>
                ${product.storage} units
            </td>

            <td>
                ₹${product.benefit}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteProduct(${index})">

                    Delete

                </button>

            </td>

        `;


        // Add row to table
        table.appendChild(row);

    });


    // Update product count
    document.getElementById("productCount").textContent =
        products.length;

}


/* =====================================================
   ADD NEW PRODUCT
   ===================================================== */

/*
   This function reads the values
   entered by the user and adds
   a new product.
*/

function addProduct() {

    // Get product name
    const name =
        document.getElementById("productName").value.trim();


    // Get storage value
    const storage =
        Number(document.getElementById("productStorage").value);


    // Get benefit value
    const benefit =
        Number(document.getElementById("productBenefit").value);


    // Check whether all values are valid
    if (
        name === "" ||
        storage <= 0 ||
        benefit < 0
    ) {

        alert(
            "Please enter valid product details."
        );

        return;

    }


    // Create new product object
    const newProduct = {

        name: name,

        storage: storage,

        benefit: benefit

    };


    // Add product to array
    products.push(newProduct);


    // Display updated products
    displayProducts();


    // Clear input fields
    document.getElementById("productName").value = "";

    document.getElementById("productStorage").value = "";

    document.getElementById("productBenefit").value = "";


    // Update dashboard
    updateDashboard();

}


/* =====================================================
   DELETE PRODUCT
   ===================================================== */

/*
   Deletes a product from the inventory list.
*/

function deleteProduct(index) {

    // Remove product from array
    products.splice(index, 1);


    // Refresh product table
    displayProducts();


    // Update dashboard
    updateDashboard();

}


/* =====================================================
   UPDATE WAREHOUSE CAPACITY
   ===================================================== */

/*
   This function is called when
   the user changes warehouse capacity.
*/

function updateCapacity() {

    // Read new capacity
    warehouseCapacity =
        Number(
            document.getElementById("capacityInput").value
        );


    // Make sure capacity is valid
    if (warehouseCapacity < 1) {

        warehouseCapacity = 1;

        document.getElementById("capacityInput").value = 1;

    }


    // Update dashboard
    updateDashboard();

}


/* =====================================================
   MAIN OPTIMIZATION FUNCTION
   ===================================================== */

/*
   This is the MAIN DAA algorithm.

   Algorithm:
   0/1 Knapsack using Dynamic Programming.

   Goal:
   Select products that maximize benefit
   without exceeding warehouse capacity.
*/

function optimizeInventory() {


    /* -------------------------------------------------
       STEP 1: GET INPUT VALUES
       ------------------------------------------------- */

    const n = products.length;

    const capacity = warehouseCapacity;


    /* -------------------------------------------------
       STEP 2: CREATE DP TABLE
       ------------------------------------------------- */

    /*
       dp[i][w] means:

       Maximum benefit obtained using
       first i products with capacity w.
    */

    const dp = Array.from(

        { length: n + 1 },

        () => Array(capacity + 1).fill(0)

    );


    /* -------------------------------------------------
       STEP 3: BUILD DP TABLE
       ------------------------------------------------- */

    /*
       Loop through every product.
    */

    for (let i = 1; i <= n; i++) {


        // Current product
        const product = products[i - 1];


        /*
           Loop through every possible
           storage capacity.
        */

        for (let w = 0; w <= capacity; w++) {


            /*
               CASE 1:
               Product requires more space
               than the current capacity.

               Therefore, we cannot select it.
            */

            if (product.storage > w) {

                dp[i][w] =
                    dp[i - 1][w];

            }


            /*
               CASE 2:
               Product can fit.

               We compare:

               1. Do not select product
               2. Select product
            */

            else {


                // Benefit if product is NOT selected
                const skip =
                    dp[i - 1][w];


                // Benefit if product IS selected
                const take =
                    product.benefit +
                    dp[
                        i - 1
                    ][
                        w - product.storage
                    ];


                /*
                   Select the option
                   with maximum benefit.
                */

                dp[i][w] =
                    Math.max(
                        skip,
                        take
                    );

            }

        }

    }


    /* -------------------------------------------------
       STEP 4: FIND MAXIMUM BENEFIT
       ------------------------------------------------- */

    /*
       Last cell contains the
       maximum possible benefit.
    */

    const maximumBenefit =
        dp[n][capacity];


    /* -------------------------------------------------
       STEP 5: BACKTRACKING
       ------------------------------------------------- */

    /*
       Now we find WHICH products
       produced the maximum benefit.
    */

    let selectedProducts = [];

    let w = capacity;


    /*
       Start from the last product
       and move backwards.
    */

    for (let i = n; i > 0; i--) {


        /*
           If current value is different
           from previous row, the product
           was selected.
        */

        if (
            dp[i][w] !==
            dp[i - 1][w]
        ) {


            // Get selected product
            const product =
                products[i - 1];


            // Add product to selected list
            selectedProducts.push(product);


            // Reduce remaining capacity
            w -= product.storage;

        }

    }


    /* -------------------------------------------------
       STEP 6: CALCULATE STORAGE USED
       ------------------------------------------------- */

    let storageUsed = 0;


    // Add storage of selected products
    selectedProducts.forEach(function (product) {

        storageUsed += product.storage;

    });


    /* -------------------------------------------------
       STEP 7: DISPLAY RESULT
       ------------------------------------------------- */

    displayResult(

        selectedProducts,

        maximumBenefit,

        storageUsed,

        capacity

    );

}


/* =====================================================
   DISPLAY OPTIMIZATION RESULT
   ===================================================== */

/*
   Displays the result returned
   by the Dynamic Programming algorithm.
*/

function displayResult(
    selectedProducts,
    maximumBenefit,
    storageUsed,
    capacity
) {


    // Make result section visible
    document.getElementById(
        "resultSection"
    ).style.display = "block";


    /* -------------------------------------------------
       DISPLAY MAXIMUM BENEFIT
       ------------------------------------------------- */

    document.getElementById(
        "resultBenefit"
    ).textContent =
        "₹" + maximumBenefit;


    /* -------------------------------------------------
       DISPLAY STORAGE USED
       ------------------------------------------------- */

    document.getElementById(
        "resultStorage"
    ).textContent =
        storageUsed + " / " + capacity;


    /* -------------------------------------------------
       DISPLAY NUMBER OF PRODUCTS
       ------------------------------------------------- */

    document.getElementById(
        "resultProducts"
    ).textContent =
        selectedProducts.length;


    /* -------------------------------------------------
       DISPLAY SELECTED PRODUCTS
       ------------------------------------------------- */

    const list =
        document.getElementById(
            "selectedList"
        );


    // Clear previous result
    list.innerHTML = "";


    // Display every selected product
    selectedProducts.forEach(function (product) {

        const item =
            document.createElement("div");


        item.className =
            "selected-product";


        item.innerHTML = `

            <strong>
                ${product.name}
            </strong>

            <span>
                ${product.storage} units
                • ₹${product.benefit}
            </span>

        `;


        list.appendChild(item);

    });


    /* -------------------------------------------------
       UPDATE DASHBOARD
       ------------------------------------------------- */

    document.getElementById(
        "spaceUsed"
    ).textContent =
        storageUsed;


    document.getElementById(
        "benefitDisplay"
    ).textContent =
        "₹" + maximumBenefit;


    // Update progress bar
    updateProgress(

        storageUsed,

        capacity

    );


    // Scroll to result
    document.getElementById(
        "resultSection"
    ).scrollIntoView({

        behavior: "smooth"

    });

}


/* =====================================================
   UPDATE DASHBOARD
   ===================================================== */

/*
   Updates the dashboard cards
   without running optimization.
*/

function updateDashboard() {


    // Display warehouse capacity
    document.getElementById(
        "capacityDisplay"
    ).textContent =
        warehouseCapacity;


    // Update hero capacity
    document.getElementById(
        "heroCapacity"
    ).textContent =
        warehouseCapacity;


    // Calculate currently displayed inventory space
    let totalStorage = 0;


    products.forEach(function (product) {

        totalStorage += product.storage;

    });


    /*
       Do not allow dashboard percentage
       to exceed 100%.
    */

    const used =
        Math.min(
            totalStorage,
            warehouseCapacity
        );


    // Update current space
    document.getElementById(
        "spaceUsed"
    ).textContent =
        used;


    // Update hero current storage
    document.getElementById(
        "heroUsed"
    ).textContent =
        used;


    // Update progress
    updateProgress(

        used,

        warehouseCapacity

    );


    // Update utilization percentage
    const percentage =
        Math.round(
            (used / warehouseCapacity) * 100
        );


    document.getElementById(
        "utilizationText"
    ).textContent =
        percentage + "%";

}


/* =====================================================
   UPDATE PROGRESS BARS
   ===================================================== */

/*
   Updates both progress bars:
   1. Hero warehouse status
   2. Optimization engine
*/

function updateProgress(
    used,
    capacity
) {


    // Calculate percentage
    let percentage =
        Math.round(
            (used / capacity) * 100
        );


    // Prevent percentage above 100
    percentage =
        Math.min(
            percentage,
            100
        );


    /* -------------------------------------------------
       HERO PROGRESS BAR
       ------------------------------------------------- */

    document.getElementById(
        "heroProgress"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "heroPercentage"
    ).textContent =
        percentage + "% utilized";


    /* -------------------------------------------------
       OPTIMIZATION PROGRESS BAR
       ------------------------------------------------- */

    document.getElementById(
        "utilizationBar"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "utilizationText"
    ).textContent =
        percentage + "%";

}


/* =====================================================
   SCROLL TO OPTIMIZATION
   ===================================================== */

/*
   Called when the user clicks
   "Start Optimizing".
*/

function scrollToOptimization() {

    // Find optimization section
    const section =
        document.getElementById(
            "optimization"
        );


    // Smoothly scroll to it
    section.scrollIntoView({

        behavior: "smooth"

    });

}