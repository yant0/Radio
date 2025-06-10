package work.agha.servlets;

import java.io.IOException;
import java.sql.*;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;

@WebServlet("/unfavorite")
public class Unfavorite extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        int userId = (int) session.getAttribute("userId");
        Map<String, String> body = new Gson().fromJson(request.getReader(), Map.class);
        String url = body.get("url");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement stmt = conn
                    .prepareStatement("DELETE FROM favorites WHERE user_id = ? AND station_url = ?");
            stmt.setInt(1, userId);
            stmt.setString(2, url);
            stmt.executeUpdate();
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        response.setStatus(HttpServletResponse.SC_OK);
    }
}
