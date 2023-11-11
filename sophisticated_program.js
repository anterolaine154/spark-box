/*
 * Filename: sophisticated_program.js
 * Description: This is a sophisticated program that implements a complex algorithm for finding prime numbers within a given range.
 */

// Function to check if a number is prime
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }
    
    return true;
}

// Function to find prime numbers within a given range
function findPrimesInRange(start, end) {
    let primes = [];
    
    for (let i = start; i <= end; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    
    return primes;
}

// Usage Example
let startNumber = 1;
let endNumber = 100;

console.log(`Printing prime numbers between ${startNumber} and ${endNumber}:`);
console.log(findPrimesInRange(startNumber, endNumber));
// Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]