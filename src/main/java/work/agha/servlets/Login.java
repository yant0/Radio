package work.agha.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import java.io.IOException;
import java.sql.*;
import work.agha.servlets.Database;

@WebServlet("/login")
public class Login extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        try (Connection conn = Database.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE username = ?");
            stmt.setString(1, username);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");
                if (BCrypt.checkpw(password, storedHash)) {
                    response.setStatus(200);
                    response.getWriter().write("{\"message\":\"Login successful\"}");
                    HttpSession session = request.getSession(true);
                    session.setAttribute("username", username);
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
            response.getWriter().write("Server error");
        }
    }
}
