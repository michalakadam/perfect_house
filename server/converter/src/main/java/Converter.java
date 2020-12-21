import org.json.XML;
import org.json.JSONException;

final class Converter {

    private static int INDENT_SIZE = 4;

    static void convertToJson(String xmlContent) {
        try {
            System.out.println(XML.toJSONObject(xmlContent).toString(INDENT_SIZE));
        } catch (JSONException jsonException) {
            System.out.println(jsonException.toString());
        }
    }
}
