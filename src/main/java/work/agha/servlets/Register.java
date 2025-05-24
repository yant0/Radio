package work.agha.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import java.io.IOException;
import java.sql.*;

@WebServlet("/register")
public class Register extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (Connection conn = Database.getConnection()) {
            PreparedStatement check = conn.prepareStatement("SELECT * FROM users WHERE username = ? OR email = ?");
            check.setString(1, username);
            check.setString(2, email);
            ResultSet rs = check.executeQuery();

            if (rs.next()) {
                response.setStatus(409);
                response.getWriter().write("{\"message\":\"Username already exists\"}");
                return;
            }

            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
            PreparedStatement stmt = conn
                    .prepareStatement("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            stmt.setString(1, username);
            stmt.setString(2, email);
            stmt.setString(3, hashedPassword);

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                response.setStatus(200);
                response.getWriter().write("{\"message\":\"Registration successful\"}");
            } else {
                response.setStatus(500);
                response.getWriter().write("{\"message\":\"Registration failed\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().write("{\"message\":\"Server error\"}");
        }
    }
}
