package work.agha.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.util.*;

import com.google.gson.Gson;
import de.sfuhrm.radiobrowser4j.*;

@WebServlet("/searchStationsByLocale")
public class SearchCountry extends HttpServlet {

    private static final int TIMEOUT_DEFAULT = 5000;
    private static final String USER_AGENT = "radio.agha.work/v1";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String country = request.getParameter("country");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (country == null || country.isEmpty()) {
            response.setStatus(400);
            response.getWriter().write("{\"error\": \"Missing 'country' parameter\"}");
            return;
        }

        country = URLEncoder.encode(country, "UTF-8").replace("+", "%20");

        try (PrintWriter out = response.getWriter()) {
            String endpoint = "https://all.api.radio-browser.info";
            RadioBrowser radioBrowser = new RadioBrowser(
                    ConnectionParams.builder()
                            .apiUrl(endpoint)
                            .userAgent(USER_AGENT)
                            .timeout(TIMEOUT_DEFAULT)
                            .build());

            List<Station> stations = radioBrowser
                    .listStationsBy(SearchMode.BYCOUNTRYCODEEXACT, country,
                            ListParameter.create().order(FieldName.NAME))
                    .limit(20)
                    .toList();

            List<Map<String, String>> result = new ArrayList<>();
            for (Station s : stations) {
                Map<String, String> entry = new HashMap<>();
                entry.put("name", s.getName());
                entry.put("url", s.getUrl());
                entry.put("favicon", s.getFavicon());
                entry.put("country", s.getCountryCode());
                entry.put("codec", s.getCodec());
                entry.put("hls", s.getHls());
                entry.put("tags", s.getTags());
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
