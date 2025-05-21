package work.agha.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

import com.google.gson.Gson;

import de.sfuhrm.radiobrowser4j.*;

@WebServlet("/searchStations")
public class SearchStations extends HttpServlet {

    private static final int TIMEOUT_DEFAULT = 5000;
    private static final String USER_AGENT = "radio.agha.work/v1";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String query = request.getParameter("q");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            Optional<String> endpoint = new EndpointDiscovery(USER_AGENT).discover();
            RadioBrowser radioBrowser = new RadioBrowser(
                    ConnectionParams.builder()
                            .apiUrl(endpoint.get())
                            .userAgent(USER_AGENT)
                            .timeout(TIMEOUT_DEFAULT)
                            .build());

            List<Station> stations = radioBrowser
                    .listStationsBy(SearchMode.BYNAME, query, ListParameter.create().order(FieldName.NAME))
                    .limit(20)
                    .toList();

            List<Map<String, String>> result = new ArrayList<>();
            for (Station s : stations) {
                Map<String, String> entry = new HashMap<>();
                entry.put("name", s.getName());
                entry.put("url", s.getUrl());
                entry.put("favicon", s.getFavicon());
                result.add(entry);
            }

            out.print(new Gson().toJson(result));
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
