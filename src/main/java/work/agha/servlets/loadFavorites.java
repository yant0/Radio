package work.agha.servlets;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.*;

import work.agha.servlets.DBConnection;

@WebServlet("/loadFavorites")
public class loadFavorites extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        HttpSession session = request.getSession(false);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\": \"User not logged in\"}");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        List<Map<String, String>> favorites = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement(
                    "SELECT station_name, station_url, station_favicon " +
                            "FROM favorites WHERE user_id = ?");
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Map<String, String> station = new HashMap<>();
                station.put("name", rs.getString("station_name"));
                station.put("url", rs.getString("station_url"));
                station.put("favicon", rs.getString("station_favicon"));
                favorites.add(station);
            }

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Database error\"}");
            e.printStackTrace();
            return;
        }

        String json = new Gson().toJson(favorites);
        out.print(json);
    }
}
