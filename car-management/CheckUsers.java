import java.sql.*;

public class CheckUsers {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/car_db";
        String user = "root";
        String password = "Pratiksha@05"; // Corrected password

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id, email, role FROM users")) {
            
            System.out.println("ID | Email | Role");
            System.out.println("---|---|---");
            while (rs.next()) {
                System.out.println(rs.getInt("id") + " | " + rs.getString("email") + " | " + rs.getString("role"));
            }
        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
