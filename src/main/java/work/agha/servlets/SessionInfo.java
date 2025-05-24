package work.agha.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/session-info")
public class SessionInfo extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (session != null && session.getAttribute("username") != null) {
            String username = (String) session.getAttribute("username");
            response.getWriter().write("{\"loggedIn\": true, \"username\": \"" + username + "\"}");
        } else {
            response.getWriter().write("{\"loggedIn\": false}");
        }
    }
}
