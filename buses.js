// Export the bus data
const busData = [
    {
        "busId": "E-1",
        "route": "Jadavpur 8B to Howrah Station",
        "stops": ["Jadavpur 8B", "Jadavpur University", "Dhakuria", "Golpark", "Southern Avenue", "Rashbihari", "Kalighat", "Hazra More", "Bhowanipore", "Rabindra Sadan", "Maidan", "Park Street", "Esplanade", "Dalhousie", "Burrabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "AC-1",
        "route": "Jadavpur 8B to Howrah Station",
        "stops": ["South City", "Anwarsah Road", "Tollygunge Phari", "Rashbihari", "Kalighat", "Hazra More", "Bhowanipore", "Rabindra Sadan", "Maidan", "Park Street", "Esplanade", "Dalhousie", "Burrabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S-2",
        "route": "Kudghat to Howrah Station",
        "stops": ["Kudghat", "Tollygunge", "Rashbehari", "Kalighat", "Hazra More", "Bhowanipore", "Rabindra Sadan", "Maidan", "Park Street", "Esplanade", "Dalhousie", "Barabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "AC-2",
        "route": "Barasat Chapadali to Howrah Station",
        "stops": ["Barasat Chapadali", "Dakbanglow More", "Madhyamgram", "BT College", "Birati More", "Airport 1no.", "Kaikhali", "Haldirams", "Baguiati", "Kestopur", "Dumdum Park", "Laketown", "Sreebhumi", "Ultadanga", "Kankurgachi", "Maniktala", "Girish Park", "MG Road", "Barabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S-2N",
        "route": "Kudghat to Nabanna",
        "stops": ["Kudghat", "Tollygunge", "Rashbehari", "Kalighat", "Hazra More", "Bhowanipore", "Rabindra Sadan", "PTS", "Vidyasagar Setu", "Nabanna"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S3A",
        "route": "Thakurpukur to Sealdah (Rajabazar)",
        "stops": ["Thakurpukur Bazar", "Shilpara", "Sakherbazar", "Behala Chowrasta", "Taratala", "Mominpur", "Ekbalpur", "Khiderpur", "Hastings", "Princep Ghat", "Babughat", "GPO", "Tea Board", "Central", "Boubazar", "Medical College", "College Street", "Suryasen Street", "Jagat Cinema", "Rajabazar Tram Depot", "Sealdah"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S3B",
        "route": "Behala 14 Number to Kankurgachi",
        "stops": ["Behala 14 Number", "Taratala", "Mominpur", "Ekbalpur", "Khiderpur", "Hastings", "Princep Ghat", "Babughat", "BBD Bag", "Lalbazar", "Central", "Boubazar", "Sealdah", "Rajabazar", "Manicktala", "Bagmari Bazar", "Kankurgachi"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S3W",
        "route": "New Town to Thakurpukur",
        "stops": ["New Town", "Salt Lake", "Ultadanga", "Park Circus", "Taratala", "Thakurpukur"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S4",
        "route": "Parnashree to Saltlake Karunamoyee",
        "stops": ["Parnashree", "Taratala", "New Alipore", "Mahabirtala", "Tollygunj Phari", "Rashbihari Crossing", "Deshoprio Park", "Gariahat", "Kasba", "Acropolis Mall", "Ruby Crossing", "EM Bypass", "Science City", "Chingrighata", "Building More", "Apollo", "Saltlake Gate", "PNB", "Tank No. 4", "Quality", "Baisakhi", "Purta Bhawan", "Bidyut Bhawan", "Saltlake Karunamoyee"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S4C",
        "route": "Haridevpur to Howrah Station",
        "stops": ["Haridevpur", "Tollygunge", "Karunamoyee", "Tollygunge Metro", "Tollygunge Phari", "Rashbehari Xing", "Hazra Xing", "Jadu Babu r Bajar", "Elgin Road", "Exide", "Maidan", "Park Street", "Raj Bhawan", "Dalhousie", "GPO", "Strand Road", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S4D",
        "route": "Parnashree to New Town Bus Stand",
        "stops": ["Parnashree", "State Garage", "Taratala", "New Alipore", "Mahabirtala", "Tollygunge Phari", "Prince Anwar Shah Connector", "Lords More", "Jadavpur PS", "Sapuipara", "Kalikapur", "Ruby Crossing", "Fortis", "Uttar Panchannagram", "Science City", "Dhapa", "Mathpukur", "Chingrighata", "Building More", "Stadium Island", "GD", "Sushrut Eye Hospital", "Wipro", "College More", "Technopolis", "DLF1", "Newtown Bus Stand"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "E4",
        "route": "Parnashree to Howrah Bus Stand (Executive)",
        "stops": ["Parnashree", "Taratala Depot", "Majerhat", "Mominpore", "Khidirpur", "Hastings", "Fort William", "Mayo Road", "Curzon Park", "Dalhousie", "Burrabazar", "Howrah Bus Stand"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "AC4",
        "route": "Parnashree to Howrah Bus Stand",
        "stops": ["Parnashree", "Taratala Depot", "Majherhat", "Mominpur", "Alipur Zoo", "Exide Crossing", "Park Street", "Raj Bhawan", "Dalhousie", "GPO", "Strand Road", "Howrah Bus Stand"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S5",
        "route": "Garia 5no. Bus Stand to Howrah Station",
        "stops": ["Garia 5no. Bus Stand", "Baishnabghata", "Ramgarh", "Baghajatin", "Sulekha", "Jadavpur 8B", "Jadavpur PS", "Jodhpur Park", "Dhakuria", "Golpark", "Southern Avenue", "Rabindra Sarobar Stadium", "Rashbehari", "Kalighat", "Hazra", "Bhowanipur", "Elgin Crossing", "Exide", "Rabindra Sadan", "Maidan", "Park Street", "Mayo Road", "Esplanade", "BBD Bag", "Burrabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S5/N",
        "route": "Garia 5no. Bus Stand to Nabanna Bus Terminus",
        "stops": ["Garia 5no. Bus Stand", "Baishnabghata", "Ramgarh", "Baghajatin", "Sulekha", "Jadavpur 8B", "Jadavpur PS", "Jodhpur Park", "Dhakuria", "Golpark", "Southern Avenue", "Rabindra Sarobar Stadium", "Rashbehari", "Kalighat", "Hazra", "Bhowanipur", "Elgin Crossing", "Exide", "Rabindra Sadan", "PTS", "Nabanna Bus Terminus"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "AC5",
        "route": "Garia 5no. Bus Stand to Howrah Station",
        "stops": ["Garia 5no. Bus Stand", "Baishnabghata", "Ramgarh", "Baghajatin", "Sulekha", "Jadavpur 8B", "Jadavpur PS", "Jodhpur Park", "Dhakuria", "Golpark", "Gariahat", "Deshoprio Park", "Rashbehari", "Kalighat", "Hazra", "Bhowanipur", "Elgin Crossing", "Exide", "Rabindra Sadan", "Maidan", "Park Street", "Mayo Road", "Esplanade", "BBD Bag", "Burrabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "7A",
        "route": "Sarsuna Bus Terminus to Howrah Station",
        "stops": ["Sarsuna Bus Terminus", "Bakultala", "Behala Chowrasta", "Manton", "Behala 14 Number", "Taratala", "Majherhat", "Mominpur", "Ekbalpur", "Khiderpur", "Hastings", "Fort William", "Esplanade", "Dalhousie", "GPO", "Shipping Corporation", "Burrabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S7",
        "route": "Garia 6no. Bus Stand to Howrah Station",
        "stops": ["Garia 6no. Bus Stand", "Naktala", "Bansdroni", "Netaji Nagar", "Ranikuthi", "Malancha", "Tollygunge Metro", "Tollygunge Phari", "Rashbehari Xing", "Hazra Xing", "Jadu Babu r Bajar", "Elgin Road", "Exide", "Maidan", "Park Street", "Raj Bhawan", "Dalhousie", "GPO", "Burrabazar", "Howrah Station"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    },
    {
        "busId": "S22",
        "route": "Shakuntala Park to Karunamoyee",
        "stops": ["Shakuntala Park", "Behala", "Tollygunge", "Rashbehari", "Esplanade", "Karunamoyee"],
        "timings": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    }
];

export default busData;