<%@ page session="false" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" language="java" %>
<%
    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy");
    request.setAttribute("year", sdf.format(new java.util.Date()));
%>

<!DOCTYPE html>
<html>
<head>
    <title>Arcanoid</title>
    <meta charset="UTF-8">
    <script defer type="text/javascript" src="Game.js"></script>
    <link href="style.css" rel="stylesheet" type="text/css"/>
</head>

<body>
<div class="curved wrapper">
    <div class="navigation curved container">
        <%@ include file="navbar.html" %>
    </div>


    <div class="center curved container">
        <b>Arcanoid Game</b>
        <canvas id="canvas" class="canvas" width="1360" height="750">
            Your browser doesn't support canvas!
        </canvas>

    </div>

    <div class=" footer curved container">
        <%@ include file="footer.html" %>
    </div>
</div>

<p class="copyright">Copyright &copy;2015-${year}. All Rights Reserved</p>

</body>

</html>