import org.json.JSONObject;
import org.json.XML;
import org.json.JSONException;

final class Converter {

    private static int PRETTY_PRINT_INDENT_FACTOR = 4;

    void convertToJson() {
        try {
            JSONObject xmlJsonObject = XML.toJSONObject("");
            String jsonPrettyPrintString = xmlJsonObject.toString(PRETTY_PRINT_INDENT_FACTOR);
            System.out.println(jsonPrettyPrintString);
        } catch (JSONException jsonException) {
            System.out.println(jsonException.toString());
        }
    }
}
