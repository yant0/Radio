package work.agha.servlets;

import de.sfuhrm.radiobrowser4j.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import com.google.gson.Gson;

@WebServlet("/stations")
public class ListStations extends HttpServlet {

    private static final int TIMEOUT_DEFAULT = 5000;
    private static final int LIMIT_DEFAULT = 20;
    private static final String USER_AGENT = "radio.agha.work/v1";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            Optional<String> endpoint = new EndpointDiscovery(USER_AGENT).discover();
            if (endpoint.isEmpty()) {
                try {
                    if (endpoint.isEmpty()) { // fallback
                        endpoint = Optional.of("https://de1.api.radio-browser.info");
                    }
                } catch (Exception e) {
                    response.setStatus(500);
                    out.print("{\"error\": \"No API endpoint found\"}");
                    return;
                }
            }
            RadioBrowser radioBrowser = new RadioBrowser(
                    ConnectionParams.builder()
                            .apiUrl(endpoint.get())
                            .userAgent(USER_AGENT)
                            .timeout(TIMEOUT_DEFAULT)
                            .build());

            List<Station> stations = radioBrowser
                    .listStations(ListParameter.create().order(FieldName.NAME))
                    .limit(LIMIT_DEFAULT)
                    .toList();

            // Prepare simple JSON output (name + url)
            List<Map<String, String>> result = new ArrayList<>();
            for (Station s : stations) {
                Map<String, String> entry = new HashMap<>();
                entry.put("name", s.getName());
                entry.put("url", s.getUrl());
                entry.put("favicon", s.getFavicon());
                result.add(entry);
            }

            String json = new Gson().toJson(result);
            out.print(json);
            out.flush();

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
