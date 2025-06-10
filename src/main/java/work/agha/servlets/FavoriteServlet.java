package work.agha.servlets;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;

import work.agha.servlets.DBConnection;

@WebServlet("/addFavorite")
public class FavoriteServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"message\": \"Not logged in.\"}");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        StringBuilder jsonBuffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuffer.append(line);
        }

        JsonObject json = JsonParser.parseString(jsonBuffer.toString()).getAsJsonObject();
        String name = json.get("name").getAsString();
        String url = json.get("url").getAsString();
        String favicon = json.has("favicon") && !json.get("favicon").isJsonNull()
                ? json.get("favicon").getAsString()
                : null;

        try (Connection conn = DBConnection.getConnection()) {
            // Check if already favorited by name + user
            String checkQuery = "SELECT id FROM favorites WHERE user_id = ? AND station_name = ?";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkQuery)) {
                checkStmt.setInt(1, userId);
                checkStmt.setString(2, name);
                ResultSet rs = checkStmt.executeQuery();
                if (rs.next()) {
                    out.print("{\"message\": \"Already favorited.\"}");
                    return;
                }
            }

            // Insert new favorite
            String insertQuery = "INSERT INTO favorites (user_id, station_name, station_url, station_favicon) VALUES (?, ?, ?, ?)";
            try (PreparedStatement insertStmt = conn.prepareStatement(insertQuery)) {
                insertStmt.setInt(1, userId);
                insertStmt.setString(2, name);
                insertStmt.setString(3, url);
                insertStmt.setString(4, favicon);
                insertStmt.executeUpdate();
            }

            out.print("{\"message\": \"Station favorited!\"}");
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"message\": \"Database error.\"}");
        }
    }
}
