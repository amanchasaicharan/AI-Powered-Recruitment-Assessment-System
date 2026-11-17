import java.util.*;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        int[] nums = new int[n];

        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }

        int[] result = new int[n];

        // Product of elements to the left
        int leftProduct = 1;

        for (int i = 0; i < n; i++) {
            result[i] = leftProduct;
            leftProduct *= nums[i];
        }

        // Product of elements to the right
        int rightProduct = 1;

        for (int i = n - 1; i >= 0; i--) {
            result[i] *= rightProduct;
            rightProduct *= nums[i];
        }

        for (int i = 0; i < n; i++) {
            System.out.print(result[i]);

            if (i < n - 1) {
                System.out.print(" ");
            }
        }

        sc.close();
    }
}