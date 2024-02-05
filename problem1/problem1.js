// using FOR loop iteration
var sum_to_n_a = function(n) {
    // your code here
    if (n < 0) {
        return alert("Input should be a non-negative integer.");
    }

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
};

// Test A
console.log(sum_to_n_a(5));  // Output: 15
console.log(sum_to_n_a(10)); // Output: 55
console.log(sum_to_n_a(0));  // Output: 0
console.log(sum_to_n_a(-1)); // Alert pop up

// using arithmatic progression formula
var sum_to_n_b = function(n) {
    // your code here
    if (n < 0) {
        return alert("Input should be a non-negative integer.");
    }
    return (n * (n + 1)) / 2;
};

// Test B
console.log(sum_to_n_b(5));  // Output: 15
console.log(sum_to_n_b(10)); // Output: 55
console.log(sum_to_n_b(0));  // Output: 0
console.log(sum_to_n_b(-1)); // Alert pop up
  
// using recursion
var sum_to_n_c = function(n) {
    // your code here
    if (n < 0) {
        return alert("Input should be a non-negative integer.");
    }

    if (n === 0) { // terminate recursion here
        return 0;
    } else {
        return n + sum_to_n_c(n - 1);
    }    
};

// Test C
console.log(sum_to_n_c(5));  // Output: 15
console.log(sum_to_n_c(10)); // Output: 55
console.log(sum_to_n_c(0));  // Output: 0
console.log(sum_to_n_c(-1)); // Alert pop up
  
