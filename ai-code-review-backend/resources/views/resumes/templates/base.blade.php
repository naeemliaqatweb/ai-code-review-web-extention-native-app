<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $rewrite->resume->user->name }} - Resume</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: {{ $rewrite->style_config['fontFamily'] == 'serif' ? "'Times New Roman', serif" : ($rewrite->style_config['fontFamily'] == 'mono' ? "'Courier New', monospace" : "'Helvetica', 'Arial', sans-serif") }};
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background-color: {{ $rewrite->style_config['backgroundColor'] ?? '#ffffff' }};
        }
        .container {
            padding: 50px;
            background-color: {{ $rewrite->style_config['backgroundColor'] ?? '#ffffff' }};
            min-height: 1000px;
        }
        .profile-section {
            display: table;
            width: 100%;
            border-bottom: 4px solid {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }};
            padding-bottom: 30px;
            margin-bottom: 40px;
        }
        .profile-image-container {
            display: table-cell;
            width: 120px;
            vertical-align: middle;
        }
        .profile-image {
            width: 100px;
            height: 100px;
            border-radius: 20px;
            object-cover: cover;
        }
        .header-content {
            display: table-cell;
            vertical-align: middle;
            padding-left: 30px;
        }
        .header-content h1 {
            margin: 0;
            color: #111;
            font-size: 36px;
            text-transform: uppercase;
            letter-spacing: -1px;
        }
        .contact-info {
            margin-top: 10px;
            color: #666;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .contact-info span {
            margin-right: 15px;
        }
        .section {
            margin-bottom: 35px;
        }
        .section-title {
            font-weight: 900;
            font-size: 10px;
            color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }};
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .summary p {
            font-size: {{ $rewrite->style_config['fontSize'] == 'large' ? '15px' : ($rewrite->style_config['fontSize'] == 'small' ? '12px' : '14px') }};
            color: #444;
            text-align: justify;
        }
        .experience-item {
            margin-bottom: 25px;
        }
        .experience-header {
            font-weight: bold;
            font-size: 16px;
            color: #111;
            margin-bottom: 5px;
        }
        .experience-duration {
            float: right;
            font-size: 10px;
            text-transform: uppercase;
            color: #999;
            background: #f8fafc;
            padding: 2px 8px;
            border-radius: 4px;
        }
        .experience-company {
            font-weight: bold;
            color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }};
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }
        .experience-item ul {
            margin: 10px 0 0;
            padding-left: 0;
            list-style: none;
        }
        .experience-item li {
            font-size: {{ $rewrite->style_config['fontSize'] == 'large' ? '14px' : ($rewrite->style_config['fontSize'] == 'small' ? '11px' : '13px') }};
            color: #555;
            margin-bottom: 6px;
            padding-left: 15px;
            position: relative;
        }
        .experience-item li::before {
            content: "•";
            color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }};
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        .skills-list {
            font-size: 12px;
        }
        .skill-tag {
            display: inline-block;
            background-color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }};
            color: #ffffff;
            padding: 5px 12px;
            border-radius: 6px;
            margin-right: 8px;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
        }
        .education-grid {
            display: table;
            width: 100%;
        }
        .education-item {
            display: table-cell;
            width: 50%;
            padding-right: 20px;
        }
        .education-degree {
            font-weight: bold;
            font-size: 14px;
            color: #111;
        }
        .education-institution {
            color: #666;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: bold;
            margin-top: 2px;
        }
        .education-year {
            font-size: 10px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="profile-section">
            @if($rewrite->profile_image)
            <div class="profile-image-container">
                <img src="{{ public_path('storage/' . $rewrite->profile_image) }}" class="profile-image">
            </div>
            @endif
            <div class="header-content">
                <h1>{{ $rewrite->resume->user->name }}</h1>
                <div class="contact-info">
                    <span>{{ $rewrite->contact_details['email'] ?? $rewrite->resume->user->email }}</span>
                    @if(isset($rewrite->contact_details['phone'])) <span>| {{ $rewrite->contact_details['phone'] }}</span> @endif
                    @if(isset($rewrite->contact_details['location'])) <span>| {{ $rewrite->contact_details['location'] }}</span> @endif
                </div>
            </div>
        </div>

        <div class="section summary">
            <div class="section-title">Professional Profile</div>
            <p>{{ $rewrite->summary }}</p>
        </div>

        <div class="section experience">
            <div class="section-title">Strategic Experience</div>
            @foreach($rewrite->experience as $item)
                <div class="experience-item">
                    <div class="experience-header">
                        <span class="experience-duration">{{ $item['duration'] }}</span>
                        {{ $item['role'] }}
                    </div>
                    <div class="experience-company">{{ $item['company'] }}</div>
                    <ul>
                        @foreach($item['achievements'] as $achievement)
                            <li>{{ $achievement }}</li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>

        <div style="display: table; width: 100%;">
            <div style="display: table-cell; width: 50%; vertical-align: top;">
                <div class="section skills">
                    <div class="section-title">Expertise</div>
                    <div class="skills-list">
                        @foreach($rewrite->skills as $skill)
                            <span class="skill-tag">{{ $skill }}</span>
                        @endforeach
                    </div>
                </div>
            </div>

            <div style="display: table-cell; width: 50%; vertical-align: top;">
                <div class="section education">
                    <div class="section-title">Academic Base</div>
                    @foreach($rewrite->education as $item)
                        <div class="education-item" style="display: block; width: 100%; margin-bottom: 15px;">
                            <div class="education-degree">{{ $item['degree'] }}</div>
                            <div class="education-institution">{{ $item['institution'] }}</div>
                            <div class="education-year">{{ $item['year'] }}</div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</body>
</html>
