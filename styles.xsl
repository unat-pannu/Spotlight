<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:ns="https://spotlight-tau-three.vercel.app/" 
                exclude-result-prefixes="xsl ns" 
                version="1.0">
  <xsl:output method="html" indent="yes"/>
  <xsl:param name="filter" select="'all'"/>
  <xsl:template match="/">
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&amp;family=Oswald:wght@200..700&amp;family=Roboto:ital,wght@0,100..900;1,100..900&amp;display=swap" rel="stylesheet"/>
        <title>SPOTLIGHT--Roles</title>
        <style>
            body {
                margin: 25px;
                font-family: "Roboto", sans-serif;
                font-weight: 400;
                font-style: normal;
            }
            h1 {
                font-family: "Oswald", serif;
                font-size: 3rem;
                text-align: center;
                letter-spacing: 2px;
                margin-bottom: 0;
            }
            h2, h3 {
                font-family: "Oswald", serif;
                letter-spacing: 1px;
            }
            table {
                background-color: #DFC5FE;
                width: 100%;
                border-collapse: collapse;
                border-radius: 10px;
            }
            th, td {
                border: 1px solid white;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: rgba(62, 6, 205, 0.982);
                color: white;
                border-color: white;
            }
            hr {
                align-items: center;
                width: 14%;
                margin-top: none;
                height: 3px;
                background-color: black;
                border: none;
            }
            select {
                margin-bottom: 15px;
                padding: 5px;
                font-size: 1rem;
                font-family: "Roboto", sans-serif;
            }
            form{
                text-align:right;
                font-size:0.8rem;
                margin-bottom:0;
                margin-top:0;
            }
            select{
                font-size:0.8rem;
            }
        </style>
      </head>
      <body>
        <h1>SPOTLIGHT</h1>
        <hr/>
        <div>
          <h2>Project Information</h2>
          <p><strong>Title: </strong> <xsl:value-of select="/ns:job-listing/ns:info/ns:title"/></p>
          <p><strong>Location: </strong> <xsl:value-of select="/ns:job-listing/ns:info/ns:location"/></p>
          <p><strong>Description: </strong> <xsl:value-of select="/ns:job-listing/ns:info/ns:description"/></p>
          <p><strong>Dates: </strong> <xsl:value-of select="/ns:job-listing/ns:info/ns:dates"/></p>
        </div>

        <h2>Roles Available</h2>
        <form method="get">
          <label for="filter">Filter by Role Type: </label>
          <select name="filter" id="filter" onchange="applyFilter()">
            <option value="all">All Roles</option>
            <option value="Lead">Lead Roles</option>
          </select>
        </form>

        <table id="rolesTable">
          <tr>
            <th>Role Name</th>
            <th>Type</th>
            <th>Age Range</th>
            <th>Description</th>
          </tr>
          <xsl:apply-templates select="/ns:job-listing/ns:role"/>
        </table>

        <script>
          function applyFilter() {
            var filterValue = document.getElementById("filter").value;
            var tableRows = document.querySelectorAll("#rolesTable tr");

            for (var i = 1; i &lt; tableRows.length; i++) {
              var row = tableRows[i];
              var roleType = row.cells[1].textContent.trim().toLowerCase();

              if (filterValue === 'all' || roleType === filterValue.toLowerCase()) {
                row.style.display = '';
              } else {
                row.style.display = 'none';
              }
            }
          }
        </script>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="ns:role">
    <xsl:if test="$filter = 'all' or ns:type = $filter">
      <tr>
        <td><xsl:value-of select="ns:name"/></td>
        <td>
          <xsl:choose>
            <xsl:when test="ns:type = 'Lead'">
              <xsl:value-of select="ns:type"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="ns:type"/>
            </xsl:otherwise>
          </xsl:choose>
        </td>
        <td>
          <xsl:choose>
            <xsl:when test="ns:age &lt; 18">
              <span style="color: red;">Under 18</span>
            </xsl:when>
            <xsl:when test="ns:age &gt; 60">
              <span style="color: blue;">Over 60</span>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="ns:age"/>
            </xsl:otherwise>
          </xsl:choose>
        </td>
        <td><xsl:value-of select="ns:description"/></td>
      </tr>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
