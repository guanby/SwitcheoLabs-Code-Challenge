// using FOR loop 
func sum_to_n_a(n int) int {
	// your code here
	sum := 0
    for i := 1; i <= n; i++ {
        sum += i
    }
    return sum
}
//// Efficiency/Complexity Analysis:
//// This implementation has a linear time complexity of O(n) 
//// because it iterates through the numbers from 1 to n to calculate the sum. 


// Using the arithmetic progression formula
func sum_to_n_b(n int) int {
	// your code here
	return n * (n + 1) / 2
}
//// Efficiency/Complexity Analysis:
//// This implementation has a constant time complexity of O(1) 
//// since it directly calculates the sum using a formula. 
//// It is the most efficient solution among the three.

// Using recursion 
func sum_to_n_c(n int) int {
	// your code here
	if n == 0 {
        return 0
    }
    return n + sum_to_n_c(n-1)
}
//// Efficiency/Complexity Analysis:
//// This implementation has a linear time complexity of O(n) 
//// due to the recursive nature of the function. 
//// However, it comes with additional overhead related to function calls 
//// and may lead to a stack overflow for very large values of n. 
//// It's less efficient compared to the loop-based solution for this particular problem.


// for testing
func main() {
    // Test cases for Implementation A
    fmt.Println(sum_to_n_a(5)) // Expects 15
    fmt.Println(sum_to_n_a(10)) // Expects 55
    fmt.Println(sum_to_n_a(0)) // Expects 0

	// Test cases for Implementation B
    fmt.Println(sum_to_n_b(5)) // Expects 15
    fmt.Println(sum_to_n_b(10)) // Expects 55
    fmt.Println(sum_to_n_b(0)) // Expects 0

	// Test cases for Implementation C
    fmt.Println(sum_to_n_c(5)) // Expects 15
    fmt.Println(sum_to_n_c(10)) // Expects 55
    fmt.Println(sum_to_n_c(0)) // Expects 0
}