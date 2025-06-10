package work.agha.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import java.io.IOException;
import java.sql.*;
import work.agha.servlets.DBConnection;

@WebServlet("/login")
public class Login extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement("SELECT id, password FROM users WHERE username = ?");
            stmt.setString(1, username);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");
                if (BCrypt.checkpw(password, storedHash)) {
                    int userId = rs.getInt("id"); // ✅ Get user ID

                    HttpSession session = request.getSession(true);
                    session.setAttribute("username", username); // Optional
                    session.setAttribute("userId", userId); // ✅ Store user ID

                    response.setStatus(200);
                    response.getWriter().write("{\"message\":\"Login successful\"}");
                } else {
                    response.setStatus(401);
                    response.getWriter().write("{\"message\":\"Invalid credentials\"}");
                }
            } else {
                response.setStatus(401);
                response.getWriter().write("{\"message\":\"User not found\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().write("{\"message\": \"Server error\"}");
        }
    }
}
