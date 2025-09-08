// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
/**
 * Netlify Edge Function that handles HTTP requests and returns a personalized greeting.
 *
 * @param {Request} request - The incoming HTTP request object
 * @param {Object} context - The Netlify function context object
 * @returns {Response} A Response object containing either a greeting message or an error
 *
 * @description
 * This function extracts a 'name' parameter from the URL search params and returns
 * a personalized greeting. If no name is provided, it defaults to "World".
 * In case of any errors, it returns a 500 status response with the error message.
 *
 * @example
 * // GET /?name=John
 * // Returns: "Hello John"
 *
 * @example
 * // GET /
 * // Returns: "Hello World"
 */
export default (request, context) => {
  try {
    const url = new URL(request.url);
    const subject = url.searchParams.get("name") || "World";

    return new Response(`Hello ${subject}`);
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    });
  }
};
